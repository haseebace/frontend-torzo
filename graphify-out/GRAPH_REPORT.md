# Graph Report - frontend-torzo  (2026-04-30)

## Corpus Check
- 34 files · ~447,610 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 163 nodes · 157 edges · 16 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]

## God Nodes (most connected - your core abstractions)
1. `TorrentSearch Design System` - 17 edges
2. `Torrent Scraper API Guide` - 14 edges
3. `Real-Debrid API Documentation` - 12 edges
4. `Torzo - ad-free torrent search engine` - 7 edges
5. `GET /api/v1/search endpoint` - 6 edges
6. `getAppSettings()` - 5 edges
7. `upsertAppSettings()` - 5 edges
8. `POST()` - 4 edges
9. `getSupabaseConfig()` - 4 edges
10. `getHeaders()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --conceptually_related_to--> `Torzo - ad-free torrent search engine`  [INFERRED]
  README.md → post.md
- `Torzo - ad-free torrent search engine` --conceptually_related_to--> `POST /unrestrict/link endpoint`  [INFERRED]
  post.md → realdebridapi.md
- `rargb provider (RARBG)` --references--> `Torzo - ad-free torrent search engine`  [INFERRED]
  09-detailed-api-guide.md → post.md
- `thepiratebay provider (The Pirate Bay)` --references--> `Torzo - ad-free torrent search engine`  [INFERRED]
  09-detailed-api-guide.md → post.md
- `yts provider (YTS)` --references--> `Torzo - ad-free torrent search engine`  [INFERRED]
  09-detailed-api-guide.md → post.md

## Hyperedges (group relationships)
- **Search-to-Results Flow** — search_form_tsx, results_page_tsx, result_sort, torrent_result_card, detail_page_tsx [INFERRED 0.85]
- **Shadcn UI Component System** — ui_card, ui_badge, ui_button, ui_checkbox, ui_collapsible, ui_select, ui_input, ui_skeleton [EXTRACTED 1.00]
- **Torrent Data Fetching Pipeline** — results_generic_search, results_yts_search, detail_yts_fetch, detail_generic_fetch, detail_normalize_response, torzoapi [INFERRED 0.85]
- **Real-Debrid integration flow** — torrent_actions, route_rd_proxy, route_rd_connect, crypto_encryptSecret, app_settings_upsertAppSettings [INFERRED 0.80]
- **Complete torrent-to-download workflow** — rd_endpoint_addMagnet, rd_endpoint_torrents_info, rd_endpoint_selectFiles, rd_endpoint_unrestrict_link, torrent_actions [INFERRED 0.85]
- **Provider configuration persistence** — route_settings_providers, route_rd_status, app_settings_parseProviders, app_settings_type_ProviderId [INFERRED 0.80]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (20): GET /api/v1/health endpoint, GET /api/v1/search endpoint, GET /api/v1/search/files endpoint, GET /api/v1/sources endpoint, GET /api/v1/torrents/detail endpoint, GET /api/v1/yts/movies/{movie_id} endpoint, GET /api/v1/yts/search endpoint, API error code reference (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (18): Accessibility standards (WCAG AA), Button component spec (primary/secondary/icon), Detail page screen pattern, Detail panels component spec, Homepage screen pattern, Iconography system (lucide-react), Light mode color tokens, Logo tile component spec (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.23
Nodes (12): Real-Debrid Bearer token authentication, Real-Debrid API base URL, Real-Debrid API rate limit (250 req/min), POST /torrents/addMagnet endpoint, GET /disable_access_token endpoint, POST /torrents/selectFiles/{id} endpoint, GET /torrents endpoint, GET /torrents/info/{id} endpoint (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (7): POST(), POST(), getAppSettings(), getHeaders(), getSupabaseConfig(), parseProviders(), upsertAppSettings()

### Community 6 - "Community 6"
Cohesion: 0.6
Nodes (4): GET(), getTmdbAuth(), normalizeSearchText(), scoreMovie()

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (2): clearBlurTimer(), handleSuggestionSelect()

### Community 10 - "Community 10"
Cohesion: 0.83
Nodes (3): decryptSecret(), encryptSecret(), getEncryptionKey()

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (2): Next.js agent rules, Claude configuration

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (2): Next.js Logo, Vercel Logo

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (2): Home Background JPG, Home Background SVG

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (2): App Favicon, T Logo (Torrent/Torzo)

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): File Icon

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): Globe Icon

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Window Icon

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Instagram Social Image

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): White Background Image

## Knowledge Gaps
- **27 isolated node(s):** `GET /api/v1/sources endpoint`, `API error code reference`, `Project README`, `Typography system (Plus Jakarta Sans, type scale)`, `8px spacing rhythm` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (5 nodes): `clearBlurTimer()`, `handleSuggestionSelect()`, `SearchSubmitButton()`, `selectedMovie()`, `search-form.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `Next.js agent rules`, `Claude configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `Next.js Logo`, `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `Home Background JPG`, `Home Background SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `App Favicon`, `T Logo (Torrent/Torzo)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `File Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `Globe Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `Window Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `Instagram Social Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `White Background Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Real-Debrid API Documentation` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `POST /unrestrict/link endpoint` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Torzo - ad-free torrent search engine` (e.g. with `rargb provider (RARBG)` and `thepiratebay provider (The Pirate Bay)`) actually correct?**
  _`Torzo - ad-free torrent search engine` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GET /api/v1/sources endpoint`, `API error code reference`, `Project README` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._