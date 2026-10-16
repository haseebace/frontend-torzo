# Upstream Provider API Structures

This document describes the upstream JSON APIs that Torzo consumes. Each provider has its own response shape, field naming conventions, and quirks.

---

## 1. RARBG — `https://therarbg.to`

### Endpoints

| Operation | URL |
|---|---|
| Search / Listing | `GET /get-posts/[category:<Cat>:][keywords:<query>:]format:json[/:ncategory:XXX]/?page=N` |
| Detail | `GET /post-detail/<pk>/<slug>/?format=json` |
| Torrent file | `http://itorrents.org/torrent/<INFO_HASH>.torrent?title=<title>` |

### Search Response (`/get-posts/.../format:json/`)

```jsonc
{
  "total": 248,           // int — total results across all pages
  "count": 2,             // int — results on this page
  "page_size": 50,        // int
  "links": {
    "next": "https://therarbg.to/get-posts/.../format:json/?page=2"  // string | null
  },
  "results": [
    {
      "pk": "8b51b9",     // string — primary key / item ID
      "n":  "Title...",   // string — torrent title
      "a":  1738581439,   // int — added timestamp (Unix epoch)
      "c":  "Movies",     // string — category ("Movies", "TV", "XXX", etc.)
      "s":  2227860624,   // int — size in bytes
      "u":  "Uploader",   // string — uploader username
      "se": 0,            // int — seeders
      "le": 0,            // int — leechers
      "h":  "E1DC7BF12F42D61A3022215CF6CED26646025AD0",  // string — 40-char uppercase hex info hash
      "tg": ["English", "1080p"]  // list of strings — tags (language, resolution)
    }
  ]
}
```

### Detail Response (`/post-detail/.../?format=json`)

```jsonc
{
  "eid": "8b51b9",                 // or "pk" / "id"
  "name": "Full Title...",         // or "n"
  "category_str": "XXX",           // or "category"
  "size": 2227860624,              // or "size_char" (string)
  "seeders": 0, "leechers": 0,
  "username": "Uploader",          // or "u"
  "downloads": 921,                // int — completed count
  "added": 1738581439,             // int — Unix epoch
  "language": "English",
  "info_hash": "E1DC7B...25AD0",  // or "h" — uppercase hex
  "status": "vip",                 // vip | trusted | verified
  "num_files": 1,
  "trackers": [
    "udp://tracker.therarbg.to:6969/announce"
  ],
  "files": [
    {
      "name": "file.mp4",          // or "path"
      "size": 2227860624           // or "length" — int or string
    }
  ],
  "images": [
    "https://images.example.test/screen.webp"
    // or { "url": "...", "src": "...", "page_url": "..." }
  ],
  "descr": "Screens https://xxxwebdlxxx.top/img-...html",  // HTML description
  "textlanguage": {                // optional
    "name": "English",
    "language": "en"
  }
}
```

### Field Mapping (RARGB → Normalized)

| API Field(s) | Normalized Field | Notes |
|---|---|---|
| `pk` / `eid` / `id` | `source_item_id` | First-present priority |
| `n` / `name` | `title_raw` | |
| `s` / `size` / `size_char` | `size_bytes` | Raw bytes |
| `se` / `seeders` | `seeders` | |
| `le` / `leechers` | `leechers` | |
| `a` / `added` | `uploaded_at` | Unix epoch → ISO 8601 |
| `c` / `category_str` | `canonical_category` | e.g. "Movies" → "movies" |
| `u` / `username` | `uploader` | |
| `h` / `info_hash` | `info_hash_v1` | Must match `[A-F0-9]{40}` |
| `status` | `verified` | true if vip/trusted/verified |
| `downloads` | `completed` | Detail only |
| `tg[]` / `textlanguage` | `language` | Alphabetic tags only |
| `files[]` | `files` | Normalized to `{name, size, extension}` |

### Quirks

- **Abbreviated field names**: `pk`, `n`, `a`, `c`, `s`, `u`, `se`, `le`, `h` — always triaged with full-name fallbacks
- **`descr` field**: HTML description scraped for image URLs via regex
- **`tg` tags**: Used as language fallback; numeric-only and resolution tags (e.g. "1080p") skipped
- **Magnet links**: Built locally by appending `tr=` for each tracker in the detail `trackers[]` array

---

## 2. The Pirate Bay — `https://apibay.org`

### Endpoints

| Operation | URL |
|---|---|
| Search | `GET /q.php?q=<query>&cat=<category_id>` |
| Listing (latest/top) | `GET /presearch.php` |
| Detail | `GET /t.php?id=<torrent_id>` |
| File list | `GET /f.php?id=<torrent_id>` |
| Web viewlink | `https://thepiratebay.org/description.php?id=<torrent_id>` |

**Pagination**: `q.php` is single-page only. Page > 1 returns no requests.

### Category IDs

| Category | ID |
|---|---|
| Audio / Music | 100 |
| Video / Movies / TV | 200 |
| Applications | 300 |
| Games | 400 |
| Porn / XXX | 500 |
| Other | 600 |
| All | 0 (or omitted) |

### Search Response (`/q.php`)

```jsonc
// Returns a JSON array of objects. ALL values are strings.
[
  {
    "id": "78955957",             // string — torrent ID
    "name": "Title...",           // string
    "info_hash": "4F671FF871D8FC0333CB2607A3E5BD5106C51CA6",  // UPPERCASE hex
    "leechers": "10",             // string
    "seeders": "50",              // string
    "num_files": "2",             // string
    "size": "1500000000",         // string — bytes
    "username": "VIP_Uploader",   // string
    "added": "1620000000",        // string — Unix epoch
    "status": "vip",              // string — vip | trusted | helper | moderator
    "category": "201",            // string — numeric category ID
    "imdb": "tt1234567"           // string — optional IMDb ID
  }
]
```

**No-results sentinel** (filtered out by adapter):
```json
[{ "id": "0", "name": "No results found", "info_hash": "0000...", "num_files": "0", "size": "0", "seeders": "0", "leechers": "0" }]
```

### Detail Response (`/t.php`)

Same shape as search but returns a single object (or single-element array).

### File List Response (`/f.php`)

```jsonc
// CRITICAL QUIRK: name and size are single-element ARRAYS, not strings
[
  {
    "name": ["file.mp4"],         // array with one string
    "size": ["1499000000"]        // array with one string (bytes)
  },
  {
    "name": ["file.nfo"],
    "size": ["1000000"]
  }
]
```

### Field Mapping (APIBay → Normalized)

| API Field | Normalized Field | Notes |
|---|---|---|
| `id` | `source_item_id` | |
| `name` | `title_raw` | |
| `size` | `size_bytes` | Converted from string to int |
| `seeders` | `seeders` | Converted from string to int |
| `leechers` | `leechers` | Converted from string to int |
| `added` | `uploaded_at` | Unix epoch string → ISO 8601 |
| `category` | `canonical_category` | ID range mapping |
| `username` | `uploader` | |
| `status` | `verified` | true if vip/trusted/helper/moderator/... |
| `num_files` | `file_count` | |
| `info_hash` | (magnet + source_item_id) | Lowercased |

### Quirks

- **All string types**: Every value is a JSON string, including numeric fields (`"50"` not `50`)
- **File list arrays**: `name` and `size` in `f.php` are single-element arrays `["value"]`, not plain strings
- **No pagination**: Search is single-page only
- **No `.torrent` file URL**: Only magnet links, built from 9 hardcoded trackers
- **info_hash**: Uppercase from API, lowercased by adapter
- **imdb**: Present in responses but not currently extracted

---

## 3. YTS — `https://movies-api.accel.li/api/v2`

### Endpoints

| Operation | URL |
|---|---|
| Search | `GET /list_movies.json?query_term=<q>&limit=50&page=N` |
| Detail | `GET /movie_details.json?movie_id=<id>&torrent_hash=<hash>` |

### Search Response (`/list_movies.json`)

```jsonc
{
  "status": "ok",              // must be "ok" — payload discarded otherwise
  "data": {
    "movie_count": 248,        // int
    "limit": 50,               // int
    "page_number": 1,          // int
    "movies": [
      {
        "id": 1234,            // int — movie ID
        "title_english": "Test Movie",   // string — preferred title
        "title": "Test Movie (Alt)",     // string — fallback title
        "year": 2024,          // int
        "language": "English", // string
        "url": "https://yts.mx/movie/test-movie",
        "torrents": [
          {
            "quality": "1080p",          // string
            "type": "bluray",            // string — bluray | web | hdrip
            "hash": "abcdef123456...",   // string — 40-char lowercase hex
            "size": "1.5 GB",            // string — HUMAN-READABLE with unit
            "seeds": 100,                // int
            "peers": 20,                 // int — NOTE: this is leechers
            "download_count": 5000,      // int
            "date_uploaded": "2024-03-22 10:15:30"  // string — YYYY-MM-DD HH:MM:SS
          }
        ]
      }
    ]
  }
}
```

### Detail Response (`/movie_details.json`)

Same envelope but `data.movie` (single object) instead of `data.movies[]`. The adapter matches the correct torrent variant via `torrent_hash`.

### Title Composition

Torzo composes the display title: `"{title_english} {year} {quality} [{type}]"`. The `[type]` suffix is omitted when type is "bluray".

Example: `"Test Movie 2024 1080p [web]"`

### Field Mapping (YTS → Normalized)

| API Field | Normalized Field | Notes |
|---|---|---|
| `movie.id` + `torrent.hash` | `source_item_id` | Concatenated |
| Composed title | `title_raw` | Built from title+year+quality+type |
| `torrent.size` | `size_bytes` | Parsed from human-readable ("1.5 GB" → bytes) |
| `torrent.seeds` | `seeders` | |
| `torrent.peers` | `leechers` | NOTE: YTS calls leechers "peers" |
| `torrent.download_count` | `completed` | |
| `torrent.date_uploaded` | `uploaded_at` | Parsed from `YYYY-MM-DD HH:MM:SS` |
| (hardcoded) | `canonical_category` | Always "movies" |
| `movie.language` | `language` | Detail only |

### Quirks

- **Envelope**: Always wrapped in `{"status":"ok","data":{...}}`; non-"ok" status discards payload
- **`peers` = leechers**: YTS uses "peers" for what Torzo calls leechers
- **Human-readable sizes**: `"1.5 GB"` requires unit parsing, unlike raw bytes from other providers
- **Torrent variants**: One movie → multiple torrents (720p/1080p/2160p × bluray/web). Adapter creates one record per variant
- **Movies only**: No category filtering; `category` param is ignored
- **No uploader**: YTS has no uploader/verified concept
- **No file list**: File-level data is unavailable; `file_count` always 1, `files` always empty
- **No `.torrent` file URL**: Only magnet links built from 5 hardcoded trackers

---

## Cross-Provider Comparison

| Aspect | RARBG | Pirate Bay (APIBay) | YTS |
|---|---|---|---|
| **Pagination** | Yes (`?page=N`) | No | Yes (`&page=N`) |
| **Response root** | `{"results":[...]}` | `[{...}]` (plain array) | `{"status":"ok","data":{...}}` |
| **Size format** | Raw bytes (int) | Raw bytes (string) | Human-readable ("1.5 GB") |
| **Timestamp** | Unix epoch (int) | Unix epoch (string) | `YYYY-MM-DD HH:MM:SS` |
| **Numeric types** | Mixed | All strings | Mixed |
| **Field names** | Abbreviated (`n`,`s`,`se`,`le`,`h`) | Full names | Full names |
| **File list** | Inline in detail | Separate `f.php` endpoint | Unavailable |
| **Magnet link** | Built from response trackers | Built from hardcoded list | Built from hardcoded list |
| **`.torrent` file** | `itorrents.org` redirect | None | None |
