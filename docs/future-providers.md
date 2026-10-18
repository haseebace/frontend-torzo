# TorrentGalaxy JSON Integration Reference

This document records the observed JSON endpoints and response shapes for
`https://torrentgalaxy.one/`. It is intended as an implementation reference
for a future Torzo provider adapter. The endpoints are not presented as a
stable, officially documented public API, so the adapter must be defensive and
keep normalization separate from provider-specific parsing.

## Status and discovery

The site exposes JSON twins of HTML pages through the `format=json` query
parameter. These are not conventional `/api/...` routes.

Observed on 2026-10-18:

- The homepage and post pages are accessible as HTML.
- `robots.txt` disallows `/api/`, but explicitly references the JSON twin
  pattern `/*format=json`.
- No stable public API documentation was found.
- Response keys are compact on search pages and verbose on detail pages.
- Treat response fields and URL patterns as changeable provider behavior.

## Endpoints

### Search

```http
GET https://torrentgalaxy.one/get-posts/keywords:<query>/?format=json&page=<n>
```

Example:

```text
https://torrentgalaxy.one/get-posts/keywords:superman/?format=json
```

The search response currently contains up to 50 results per page:

```jsonc
{
  "next": "https://torrentgalaxy.one/get-posts/keywords:superman/?format=json&page=2",
  "previous": null,
  "page_size": 50,
  "count": 50,
  "total": 1250,
  "results": []
}
```

### Detail

```http
GET https://torrentgalaxy.one/post-detail/<post-id>/<slug>/?format=json
```

Example:

```text
https://torrentgalaxy.one/post-detail/97bcd5/superman-2025-1080p-blu-ray-hevc-x265-10bit-ddp5-1-subs-kingdom/?format=json
```

The detail response is a single JSON object with full metadata, files,
trackers, images, and download links.

## Search response mapping

Search results currently use abbreviated keys:

```jsonc
{
  "pk": "97bcd5",                              // provider post ID
  "n": "Superman 2025 1080p Blu-Ray ...",      // title
  "a": 1786696238,                              // Unix timestamp
  "c": "Movies",                               // category
  "s": 6784029037,                              // size in bytes
  "t": null,                                    // thumbnail path or null
  "u": "EXTRG",                                // uploader
  "se": 543,                                   // seeders
  "le": 96,                                    // leechers
  "i": "tt5950044",                            // IMDb ID or null
  "h": "EFC7D166...",                          // info hash
  "tg": ["1080p", "BluRay", "x265", "AC3"]  // provider tags
}
```

### Recommended normalized mapping

| TorrentGalaxy | Normalized provider model | Notes |
|---|---|---|
| `pk` | `source_item_id` | Keep as a string. |
| `n` | `title` | Preserve the raw title for release parsing. |
| `a` | `uploaded_at` | Convert Unix seconds to ISO 8601. |
| `c` | `category` | Normalize to the app's category vocabulary. |
| `s` | `size_bytes` | Numeric bytes. |
| `t` | `thumbnail` | Relative path; resolve against the provider origin. |
| `u` | `uploader` | May be absent or anonymous. |
| `se` | `seeders` | Numeric. |
| `le` | `leechers` | Numeric. |
| `i` | `imdb_id` | Optional. |
| `h` | `info_hash` | Normalize case before comparison. |
| `tg` | `provider_tags` | Optional hints, not the only source of truth. |
| result URL | `source_url` | Prefer the provider's canonical link; do not assume a title slug is exact. |

## Detail response mapping

Observed detail fields include:

```jsonc
{
  "eid": "97bcd5",
  "pid": 6737999,
  "category_str": "Movies",
  "type": "HEVC/x265",
  "name": "Superman 2025 1080p Blu-Ray HEVC x265 10Bit DDP5.1 Subs KINGDOM",
  "size": 6784029037,
  "size_char": "6.32 GB",
  "seeders": 43,
  "leechers": 20,
  "downloads": 3324,
  "imdb": "tt5950044",
  "info_hash": "EFC7D166...",
  "files": [],
  "trackers": [],
  "images": [],
  "magnet_link": "magnet:?xt=...",
  "torrent_file_url": "http://itorrents.org/torrent/..."
}
```

Additional detail fields observed:

- `username`
- `language`
- `timestamp`
- `last_checked`
- `has_torrent`
- `source`
- `source_list`
- `upvotes`, `downvotes`, `comment_count`
- `descr` or HTML description content
- `thumbnail`
- `trackers[]` with tracker health statistics

### Files

Files are usually objects with:

```json
{
  "name": "Superman 2025 ...mkv",
  "size": 6780553099
}
```

Normalize file values to the app shape:

```ts
{
  name: string;
  size: string;
  size_bytes?: number;
  size_human?: string;
  extension: string;
}
```

Do not assume every detail response has a populated file list. Use the
top-level size as a fallback.

### Images

Detail images may be returned as URL strings or as objects such as:

```json
{
  "url": "https://example.test/screenshot.png",
  "page_url": null,
  "kind": "direct"
}
```

Normalize both forms to `{ url, page_url, kind }`, resolve relative URLs
against `https://torrentgalaxy.one/`, and preserve the original URL for the
click-through preview.

## Pagination and query behavior

- Default page size observed: `50`.
- `total` is the total result count.
- `count` is the number of results on the current page.
- `next` and `previous` may be absolute URLs; prefer following them when
  present instead of rebuilding paths manually.
- Search slugs use provider-specific path syntax such as
  `keywords:superman`.
- Search JSON may omit the canonical post slug. Preserve `pk` and the raw
  title; resolve the canonical detail URL from a provider link when available,
  and use slug generation only as a documented fallback.
- Keep query encoding isolated in the adapter. Do not concatenate raw user
  input into a path without encoding/validation.

## Tags and title metadata

Search responses include a compact `tg` list, for example:

```json
["1080p", "BluRay", "x265", "AC3", "Subbed"]
```

The title itself is richer and should remain the source for release parsing.
Observed titles contain:

- Resolution: `720p`, `1080p`, `2160p`, `4K`
- Source: `WEB-DL`, `WEBRip`, `BluRay`, `Blu-ray Remux`, `CAM`, `TS`
- Codec: `x264`, `x265`, `HEVC`, `AVC`, `AV1`
- Bit depth: `10Bit`, `10bit`
- HDR: `HDR`, `HDR10`, `HDR10+`, `DV`
- Audio: `DDP5.1`, `DD5.1`, `EAC3`, `AAC`, `DTS-HD MA`, `TrueHD`, `Atmos`
- Language/subtitle hints: `English`, `Italian`, `Hindi`, `Subs`, `Subbed`,
  `Multi`

The existing title parser should remain tolerant of punctuation, casing, and
spacing variations. Provider tags can supplement the parser but should not
replace it.

## URL and magnet behavior

- Search results expose an info hash but may not expose a ready-to-use magnet
  link.
- Detail responses may include `magnet_link` and `torrent_file_url`.
- Some magnet links contain repeated `tr=` parameters with tracker URLs.
- Older/alternate responses may encode tracker data as stringified objects;
  treat malformed tracker parameters as optional and preserve the info hash.
- Never assume the torrent file URL is HTTPS; validate or proxy it according
  to the application's security policy.

## Future-proof adapter rules

1. Keep the provider origin configurable; do not hard-code it in UI code.
2. Put all URL construction and field aliases in one provider adapter.
3. Validate the response shape before reading fields.
4. Accept both compact search keys and verbose detail keys.
5. Treat missing fields, null thumbnails, empty files, and empty images as
   normal states.
6. Normalize numeric strings and Unix timestamps at the adapter boundary.
7. Preserve `title_raw` separately from a cleaned display title.
8. Use `source_item_id + source_url` as the stable identity when possible;
   fall back to the info hash only when valid.
9. Follow `next` links for pagination and cap page size/timeouts.
10. Cache only where allowed; the JSON twin is an upstream surface that may
    change without notice.
11. Add fixture tests for at least:
    - a standard WEBRip/x265 title;
    - a Blu-ray Remux/DV/HDR10/Atmos title;
    - a YTS-style title with minimal metadata;
    - a result with missing files/images;
    - a malformed or missing `tg` array.

## Example implementation flow

```text
search(query, page)
  -> GET /get-posts/keywords:<query>/?format=json&page=<page>
  -> normalize results[]
  -> use result.pk + slug as source_url

detail(source_url)
  -> GET <source_url>?format=json
  -> normalize name, size, seeders, files, images, magnet_link
  -> parse title metadata for UI badges
```

This document records observed behavior, not a guarantee from TorrentGalaxy.
Re-check the endpoint response and update the adapter fixtures before relying
on new fields in production.
