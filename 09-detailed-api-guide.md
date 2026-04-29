# Torrent Scraper API Guide

This guide is for developers integrating with the current API.

The API is intentionally simple right now: it is a live upstream search API. It does not use a database, Redis, Celery, admin jobs, stored search indexes, or background ingestion. Every search/detail request fetches data from the upstream provider at request time.

## Quick Start

Run locally:

```bash
uv sync
./scripts/dev.sh
```

Base URL:

```text
https://torzoapi.vercel.app
```
*(For local development, the base URL is `http://127.0.0.1:8000`)*

Recommended first calls:

```http
GET /api/v1/health
GET /api/v1/sources
GET /api/v1/search?q=ubuntu&page_size=5
```

Common integration flow:

1. Call `GET /api/v1/search` with `q`, `tmdb_id`, or `imdb_id`.
2. Read `data[].sources[0].provider` and `data[].sources[0].source_url` from the chosen result.
3. Call `GET /api/v1/torrents/detail?source=...&source_url=...` for magnet links, files, images, and richer metadata.

## Current Providers

| Provider key | Generic search | Detail | Notes |
| --- | --- | --- | --- |
| `rargb` | Yes | Yes | Default generic provider. Supports paginated search and rich detail parsing. |
| `thepiratebay` | Yes | Yes | Uses APIBay JSON APIs. `tpb` is accepted as an alias. |
| `yts` | No | No | Use `/api/v1/yts/...` because YTS has a movie-first response shape. |

Generic endpoints reject `source=yts`. This is intentional.

## Response Rules

Most API responses use this envelope:

```json
{
  "data": {},
  "meta": {}
}
```

List endpoints use:

```json
{
  "data": [],
  "meta": {}
}
```

Errors use:

```json
{
  "error": {
    "code": "invalid_query",
    "message": "Provide q, tmdb_id, or imdb_id so the API has something to search for."
  }
}
```

Timestamps are ISO 8601 strings. Sizes are bytes when the field is named `size_bytes`; provider-native size strings may appear in YTS-native responses.

## Endpoints

| Method/path | Purpose |
| --- | --- |
| `GET /api/v1/health` | Liveness check. |
| `GET /api/v1/sources` | Lists available providers. |
| `GET /api/v1/search` | Searches live upstream providers and returns normalized torrent rows. |
| `GET /api/v1/search/files` | Searches provider pages and returns rows whose parsed files match an extension. |
| `GET /api/v1/torrents/detail` | Fetches one upstream detail page using a `source_url`. |
| `GET /api/v1/yts/search` | Searches YTS by IMDb ID or TMDB movie ID. |
| `GET /api/v1/yts/movies/{movie_id}` | Fetches one YTS movie detail payload. |
| `GET /metrics` | Prometheus metrics for API requests and upstream fetches. |

## Health

```http
GET /api/v1/health
```

Response:

```json
{
  "data": {
    "status": "ok",
    "database": "disabled"
  },
  "meta": {}
}
```

`database` is always `disabled` in the current live-only API.

## Sources

```http
GET /api/v1/sources
```

Response:

```json
{
  "data": [
    {
      "provider": "rargb",
      "display_name": "RARBG",
      "base_url": "https://therarbg.to"
    },
    {
      "provider": "yts",
      "display_name": "YTS",
      "base_url": "https://movies-api.accel.li/api/v2"
    },
    {
      "provider": "thepiratebay",
      "display_name": "The Pirate Bay",
      "base_url": "https://thepiratebay.org"
    }
  ],
  "meta": {}
}
```

## Search

```http
GET /api/v1/search
```

Use this for normalized live torrent search.

### Query Parameters

| Param | Required | Values | Notes |
| --- | --- | --- | --- |
| `q` | Required unless `tmdb_id` or `imdb_id` is provided | string | Whitespace-only values are rejected. |
| `category` | No | `movies`, `tv`, `games`, `music`, `anime`, `apps`, `documentaries`, `books`, `other`, `xxx` | Aliases such as `movie`, `video`, `software`, and `app` are normalized. |
| `source` | No | `rargb`, `thepiratebay`, `tpb`, comma-separated combinations | Defaults to `rargb`. Empty comma tokens are rejected. |
| `sort` | No | `relevance`, `seeders`, `recent` | Defaults to `relevance`; multi-source search reports `seeders` when omitted. |
| `page` | No | integer `>= 1` | Defaults to `1`. Sent to each selected upstream provider. |
| `page_size` | No | integer `1..100` | Slices the returned API response; it does not change upstream provider page size. |
| `tmdb_id` | No | integer | Requires `media_type`. Used to resolve a cleaner provider query. |
| `imdb_id` | No | `tt` followed by digits | May be used with or without `q`. |
| `media_type` | Required with `tmdb_id` | `movie`, `tv` | Generic search supports movie and TV TMDB IDs. |
| `year` | No | integer | Used as a hint for metadata-assisted queries. |

### Examples

```http
GET /api/v1/search?q=ubuntu&page_size=5
GET /api/v1/search?q=ubuntu&source=thepiratebay
GET /api/v1/search?q=ubuntu&source=rargb,thepiratebay&page=1&page_size=10
GET /api/v1/search?tmdb_id=299534&media_type=movie
GET /api/v1/search?q=avengers&imdb_id=tt4154796&year=2019
```

### Search Response

```json
{
  "data": [
    {
      "serial": 1,
      "id": "2a59a356-9f61-5521-be06-c540cfe34c37",
      "title": "ubuntu-24.04-desktop-amd64.iso",
      "size_bytes": 5892997120,
      "uploaded_at": "2026-04-24T18:20:55Z",
      "category": "apps",
      "verified": false,
      "seeders": 40,
      "leechers": 11,
      "file_count": null,
      "primary_file_name": null,
      "primary_file_extension": null,
      "trusted_score": 0.5,
      "health_score": 1.0,
      "source_count": 1,
      "last_seen_at": "2026-04-28T01:58:22.539358Z",
      "sources": [
        {
          "provider": "rargb",
          "source_url": "https://therarbg.to/post-detail/example/ubuntu/",
          "seeders": 40,
          "leechers": 11,
          "last_seen_at": "2026-04-28T01:58:22.539358Z",
          "verified": false
        }
      ]
    }
  ],
  "meta": {
    "query": "ubuntu",
    "resolved_query": "ubuntu",
    "query_strategy": "query",
    "tmdb_id": null,
    "imdb_id": null,
    "media_type": null,
    "year": null,
    "page": 1,
    "page_size": 1,
    "total": 45,
    "sort": "relevance",
    "total_pages": 1,
    "has_next_page": false,
    "message": null,
    "results_on_page": 45,
    "page_size_ignored": false,
    "served_from_cache": false,
    "refresh_scheduled": false,
    "cache_status": "miss",
    "file_extension": null,
    "batch": null,
    "pages_scanned_from": null,
    "pages_scanned_to": null,
    "has_next_batch": null
  }
}
```

Developer notes:

- `id` is deterministic from provider + source URL. It is useful as a stable client-side ID, but the API does not currently support lookup by ID.
- Use `sources[].source_url` for detail lookup.
- `total` and `results_on_page` describe the upstream page before `page_size` slicing.
- `served_from_cache`, `refresh_scheduled`, and `cache_status` are kept for response compatibility. In the current live-only flow they are `false`, `false`, and `miss`.
- Multi-source search requests the same `page` from each provider, combines the rows, and does not deduplicate them.

## File Search

```http
GET /api/v1/search/files
```

Use this when you only want results whose parsed file list contains a specific extension.

### Query Parameters

| Param | Required | Values | Notes |
| --- | --- | --- | --- |
| `file_extension` | Yes | `mp4`, `.mp4`, `mkv`, etc. | Normalized to include a leading dot. Blank values are rejected. |
| `q` | Required unless `tmdb_id` or `imdb_id` is provided | string | Same validation as search. |
| `category` | No | same as search | Same aliases as search. |
| `source` | No | `rargb`, `thepiratebay`, `tpb` | `yts` is rejected. |
| `sort` | No | `relevance`, `seeders`, `recent` | Same as search. |
| `batch` | No | integer `>= 1` | Defaults to `1`; each batch scans up to four pages for paginated providers. |
| `tmdb_id`, `imdb_id`, `media_type`, `year` | No | same as search | Same metadata behavior as search. |

Example:

```http
GET /api/v1/search/files?q=ubuntu&source=rargb&file_extension=mp4&batch=1
```

The response shape is the same as `/search`, but `meta` also includes:

- `file_extension`
- `batch`
- `pages_scanned_from`
- `pages_scanned_to`
- `has_next_batch`

## Torrent Detail

```http
GET /api/v1/torrents/detail
```

Use this after search when you need full detail for one result.

### Query Parameters

| Param | Required | Values | Notes |
| --- | --- | --- | --- |
| `source_url` | Yes | full `http` or `https` URL | Usually copied from `data[].sources[0].source_url`. |
| `source` | No | `rargb`, `thepiratebay`, `tpb` | Defaults to `rargb`; comma-separated values are rejected. |

Example:

```http
GET /api/v1/torrents/detail?source=rargb&source_url=https%3A%2F%2Ftherarbg.to%2Fpost-detail%2Fexample%2Fubuntu%2F
```

### Detail Response

```json
{
  "data": {
    "id": "2a59a356-9f61-5521-be06-c540cfe34c37",
    "title": "ubuntu-24.04-desktop-amd64.iso",
    "magnet_link": "magnet:?xt=urn:btih:...",
    "torrent_file_url": null,
    "info_hash": "0123456789abcdef0123456789abcdef01234567",
    "size_bytes": 5892997120,
    "uploaded_at": "2026-04-24T18:20:55Z",
    "category": "apps",
    "language": null,
    "uploader": null,
    "verified": false,
    "seeders": 40,
    "leechers": 11,
    "downloaded": null,
    "file_count": 1,
    "primary_file_name": "ubuntu-24.04-desktop-amd64.iso",
    "primary_file_extension": ".iso",
    "files": [
      {
        "name": "ubuntu-24.04-desktop-amd64.iso",
        "size": "5.27 GB",
        "extension": ".iso"
      }
    ],
    "images": [],
    "trusted_score": 0.5,
    "health_score": 1.0,
    "source_count": 1,
    "last_seen_at": "2026-04-28T01:58:22.539358Z",
    "sources": [
      {
        "provider": "rargb",
        "source_url": "https://therarbg.to/post-detail/example/ubuntu/",
        "seeders": 40,
        "leechers": 11,
        "downloaded": null,
        "last_seen_at": "2026-04-28T01:58:22.539358Z",
        "verified": false
      }
    ]
  },
  "meta": {
    "fetched_live": true,
    "lookup_source": "source_url",
    "provider": "rargb",
    "source_url": "https://therarbg.to/post-detail/example/ubuntu/"
  }
}
```

Developer notes:

- The detail endpoint fetches upstream every time.
- If the provider cannot fetch or parse the detail page, the API returns `upstream_detail_failed`.
- YTS detail is not available through this endpoint. Use `/api/v1/yts/movies/{movie_id}`.

## YTS Search

```http
GET /api/v1/yts/search
```

Use this for YTS movie search. YTS returns a movie-first native JSON shape, not the generic torrent row shape.

### Query Parameters

| Param | Required | Values | Notes |
| --- | --- | --- | --- |
| `imdb_id` | Required unless `tmdb_id` is provided | `tt` followed by digits | Example: `tt4154796`. |
| `tmdb_id` | Required unless `imdb_id` is provided | integer | Resolved to IMDb ID through TMDB. |
| `media_type` | No | `movie` | Required value is `movie` when provided. Defaults to `movie` for TMDB lookup. |
| `page` | No | integer `>= 1` | Defaults to `1`. |
| `limit` | No | integer `1..50` | Defaults to `20`. |

Examples:

```http
GET /api/v1/yts/search?imdb_id=tt4154796&page=1&limit=20
GET /api/v1/yts/search?tmdb_id=299534&media_type=movie
```

Response shape:

```json
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie_count": 1,
    "limit": 20,
    "page_number": 1,
    "movies": [
      {
        "id": 12345,
        "url": "https://yts.mx/movies/example",
        "imdb_code": "tt4154796",
        "title": "Example Movie",
        "year": 2019,
        "torrents": [
          {
            "url": "https://yts.mx/torrent/download/example",
            "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
            "magnet_link": "magnet:?xt=urn:btih:...",
            "quality": "1080p",
            "seeds": 100,
            "peers": 20,
            "size": "1.5 GB",
            "size_bytes": 1610612736
          }
        ]
      }
    ]
  },
  "@meta": {
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

The API adds `magnet_link` to YTS torrent variants when a valid hash is present.

## YTS Movie Detail

```http
GET /api/v1/yts/movies/{movie_id}
```

Example:

```http
GET /api/v1/yts/movies/12345
```

`movie_id` must be `>= 1`.

The response uses the same YTS-native movie schema as YTS search, but `data` contains one `movie` instead of a `movies` array.

## Metrics

```http
GET /metrics
```

Prometheus text output includes:

- `torzo_provider_fetch_total`
- `torzo_api_request_duration_seconds`

There are no queue, database, cache, worker, or ingestion metrics in the lean API.

## Error Reference

| Code | Status | When it happens |
| --- | --- | --- |
| `invalid_query` | 400 | Missing `q`, `tmdb_id`, and `imdb_id`, or `q` is whitespace-only. |
| `invalid_category` | 400 | `category` is not recognized. |
| `invalid_sort` | 400 | `sort` is not `relevance`, `seeders`, or `recent`. |
| `invalid_pagination` | 400 | `page`, `page_size`, or YTS `limit` is outside the allowed range. |
| `invalid_batch` | 400 | `batch` is lower than `1`. |
| `invalid_file_extension` | 400 | `file_extension` is blank. |
| `invalid_source` | 400 | Source is blank, has empty comma tokens, or detail source is comma-separated. |
| `invalid_source_url` | 400 | `source_url` is not a full `http` or `https` URL. |
| `unsupported_source` | 400 | `yts` is used with a generic endpoint. |
| `invalid_imdb_id` | 400 | IMDb ID does not look like `tt1234567`. |
| `invalid_media_type` | 400 | Missing/invalid media type for TMDB lookup, or non-movie media type on YTS. |
| `invalid_movie_id` | 400 | YTS movie ID is lower than `1`. |
| `tmdb_not_configured` | 503 | TMDB lookup was requested but `APP_TMDB_READ_ACCESS_TOKEN` is missing. |
| `tmdb_resolution_failed` | 502 | TMDB lookup failed or returned unexpected data. |
| `upstream_search_failed` | 502 | Upstream provider search failed. |
| `upstream_detail_failed` | 502 | Upstream provider detail fetch failed. |

## Integration Tips

- Treat upstream data as live and changing. Counts like `seeders` and `leechers` can change between requests.
- Do not assume every provider fills every field. Many fields can be `null`.
- Do not send YTS through generic endpoints. Use the dedicated YTS endpoints.
- For detail lookup, keep both the provider key and source URL from the selected search result.
- If you need repeatable client IDs, use `data[].id`; if you need fresh torrent detail, use `source_url`.
