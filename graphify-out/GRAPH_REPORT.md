# Graph Report - frontend-torzo  (2026-05-17)

## Corpus Check
- 54 files · ~57,289 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 584 nodes · 735 edges · 53 communities (44 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `170cdb16`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 42 edges
2. `/support` - 26 edges
3. `TorrentSearch Design System` - 17 edges
4. `Torrent Scraper API Guide` - 15 edges
5. `TorrentSearch Design System` - 15 edges
6. `API methods` - 14 edges
7. `Torrent Scraper API Guide` - 14 edges
8. `SiteNavbar()` - 12 edges
9. `Real-Debrid API Documentation` - 12 edges
10. `DetailPage()` - 9 edges

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

## Communities (53 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (45): metadata, plusJakartaSans, RootLayout(), sora, ManageAccountForm(), ManageStatus, ProviderId, providers (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (46): code:bash (uv sync), code:json ({), code:http (GET /api/v1/search), code:http (GET /api/v1/search?q=ubuntu&page_size=5), code:json ({), code:http (GET /api/v1/search/files), code:http (GET /api/v1/search/files?q=ubuntu&source=rargb&file_extensio), code:http (GET /api/v1/torrents/detail) (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (31): Accessibility, Background Treatment, Badges, Buttons, code:css (:root {), code:css (font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, ), Components, Core Direction (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): DELETE /torrents/delete/{id}, GET /torrents, GET /torrents/activeCount, GET /torrents/availableHosts, GET /torrents/info/{id}, Parameters:, Parameters:, Parameters: (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (23): cleanTitle(), DetailPage(), DetailPageProps, formatBytesFromBytes(), formatNumber(), formatPercent(), formatProviderLinkLabel(), getFileSizeDisplay() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (4): HomeContent(), SearchForm(), SiteNavbar(), Skeleton()

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): code:block10 ({), code:block11 ({), code:block12 ([\), code:block13 ({), code:block14 ({), code:block15 ([\), code:block16 ([\), code:block17 ([\) (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (14): clamp, ColdOpen(), DetailScene(), ease, FinalBrand(), flowSteps, frameIn(), providers (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (19): ResultSort(), buildPageUrl(), getMovieName(), getSelectedProviders(), parsePageParam(), Props, ResultsPage(), ResultsPageProps (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.1
Nodes (21): Parameters:, Parameters:, Parameters:, Parameters:, Possible HTTP error codes:, Possible HTTP error codes:, Possible HTTP error codes:, Possible HTTP error codes: (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (20): DELETE /settings/avatarDelete, GET /settings, Parameters:, Possible HTTP error codes:, Possible HTTP error codes:, Possible HTTP error codes:, Possible HTTP error codes:, Possible HTTP error codes: (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (20): GET /api/v1/health endpoint, GET /api/v1/search endpoint, GET /api/v1/search/files endpoint, GET /api/v1/sources endpoint, GET /api/v1/torrents/detail endpoint, GET /api/v1/yts/movies/{movie_id} endpoint, GET /api/v1/yts/search endpoint, API error code reference (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (18): Accessibility standards (WCAG AA), Button component spec (primary/secondary/icon), Detail page screen pattern, Detail panels component spec, Homepage screen pattern, Iconography system (lucide-react), Light mode color tokens, Logo tile component spec (+10 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (10): POST(), POST(), getAppSettings(), getHeaders(), getSupabaseConfig(), parseProviders(), upsertAppSettings(), decryptSecret() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (9): RealDebridError, realDebridFetch(), RealDebridRequestOptions, RealDebridAddMagnetResponse, RealDebridTorrentInfo, RealDebridTorrentSummary, RealDebridUnrestrictResponse, TorrentActions() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.23
Nodes (12): Real-Debrid Bearer token authentication, Real-Debrid API base URL, Real-Debrid API rate limit (250 req/min), POST /torrents/addMagnet endpoint, GET /disable_access_token endpoint, POST /torrents/selectFiles/{id} endpoint, GET /torrents endpoint, GET /torrents/info/{id} endpoint (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (11): GET /hosts, GET /hosts/domains, GET /hosts/regex, GET /hosts/regexFolder, GET /hosts/status, /hosts, Return value:, Return value: (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (10): code:console (npm i), code:console (npm run dev), code:console (npx remotion render), code:console (npx remotion upgrade), Commands, Docs, Help, Issues (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (10): API Endpoints Covered, Checking Results, code:block1 (api_key: "YOUR_API_KEY"), Example Variables After Successful Run, Option 1: Step-by-Step (Recommended for learning), Option 2: Quick Test (Full Flow), Real-Debrid API Testing with Postman, Setup Instructions (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (9): API methods, code:block1 (https://api.real-debrid.com/rest/1.0/), GET /disable_access_token, GET /time, GET /time/iso, Possible HTTP error codes:, Return value:, Return value: (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (9): code:block41 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), code:block42 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), Example cURL call to obtain an access token:, Example cURL call to obtain an access token:, Full workflow, Testing Two-Factor Process, Workflow for old apps, Workflow if you use a WebView / Popup (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (8): GET /traffic, GET /traffic/details, Parameters:, Possible HTTP error codes:, Possible HTTP error codes:, Return value:, Return value:, /traffic

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (8): DELETE /downloads/delete/{id}, /downloads, GET /downloads, Parameters:, Possible HTTP error codes:, Possible HTTP error codes:, Return value:, Return value:

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (8): code:block38 (https://api.real-debrid.com/oauth/v2/device/code?client_id=A), code:block39 ({), code:block40 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), Example authentication data:, Example cURL call to obtain an access token:, Example URL to obtain authentication data:, Full workflow, Workflow for opensource apps

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): Authentication, Authentication for applications, code:block29 (Authorization: Bearer your_api_token), code:block30 (/rest/1.0/method?auth_token=your_api_token), Implementation details, List of numeric error codes, Real-Debrid API Documentation

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (8): code:block35 (https://api.real-debrid.com/oauth/v2/device/code?client_id=A), code:block36 ({), code:block37 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), Example authentication data:, Example cURL call to obtain an access token:, Example URL to obtain authentication data:, Full workflow, Workflow for mobile apps

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (8): code:block31 (X245A4XAIBGVM), code:block32 (https://api.real-debrid.com/oauth/v2/), code:block43 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), Example cURL call to obtain an access token:, Full workflow, Get a new access token from a refresh token, Opensource Apps, Which authentication process should you use?

### Community 27 - "Community 27"
Cohesion: 0.29
Nodes (7): GET /streaming/mediaInfos/{id}, GET /streaming/transcode/{id}, Possible HTTP error codes:, Possible HTTP error codes:, Return value:, Return value:, /streaming

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (6): code:block33 (https://api.real-debrid.com/oauth/v2/auth?client_id=ABCDEFGH), code:block34 (curl -X POST "https://api.real-debrid.com/oauth/v2/token" -d), Example cURL call to obtain an access token:, Example URL for authorization:, Full workflow, Workflow for websites or client applications

### Community 29 - "Community 29"
Cohesion: 0.6
Nodes (4): GET(), getTmdbAuth(), normalizeSearchText(), scoreMovie()

### Community 30 - "Community 30"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (4): GET /user, Possible HTTP error codes:, Return value:, /user

### Community 33 - "Community 33"
Cohesion: 0.5
Nodes (4): code:block27 (curl -X GET \), code:block28 (HTTP/1.1 200 OK), Example calls, Getting user informations:

## Knowledge Gaps
- **261 isolated node(s):** `ease`, `clamp`, `providers`, `results`, `flowSteps` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `API methods` connect `Community 19` to `Community 32`, `Community 3`, `Community 6`, `Community 9`, `Community 10`, `Community 16`, `Community 21`, `Community 22`, `Community 24`, `Community 27`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Real-Debrid API Documentation` connect `Community 24` to `Community 33`, `Community 26`, `Community 19`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Opensource Apps` connect `Community 26` to `Community 20`, `Community 23`, `Community 24`, `Community 25`, `Community 28`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `ease`, `clamp`, `providers` to the rest of the system?**
  _261 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._