# Real-Debrid API Testing with Postman

## Setup Instructions

1. **Import the collection:**
   - Open Postman
   - Click "Import" → Select `Real-Debrid_API_Test.postman_collection.json`

2. **Set your API key:**
   - Click on the collection name "Real-Debrid API - Torrent Flow"
   - Go to "Variables" tab
   - Find `api_key` variable
   - Replace `YOUR_API_KEY_HERE` with your actual Real-Debrid API key
   - Save

3. **Set the torrent hash (optional):**
   - Find `torrent_hash` variable
   - Replace with the infoHash of the torrent you want to test

---

## Testing Flow

### Option 1: Step-by-Step (Recommended for learning)

Run these requests in order:

1. **Step 1: Get Torrents List**
   - Fetches all your torrents from Real-Debrid
   - Automatically finds the torrent with matching hash
   - Sets `torrent_id` and `first_link` variables if found

2. **Step 2: Get Torrent Info (if needed)**
   - Only needed if Step 1 didn't return links
   - Fetches detailed torrent info using the torrent ID

3. **Step 3: Check if Link is Already RD Link**
   - Checks if the link is already a Real-Debrid link
   - If yes, sets `direct_link` directly
   - If no, proceed to Step 4

4. **Step 4: Unrestrict Link**
   - Converts a hoster link to a direct download link
   - Sets `direct_link` with the unrestricted URL

---

### Option 2: Quick Test (Full Flow)

Use the "Quick Test: Full Flow" folder to run all steps sequentially:

1. **1. Get Torrents** - Gets your torrent list
2. **2. Get Torrent Info (if needed)** - Gets detailed info if links missing
3. **3. Unrestrict Link** - Gets the direct download link

---

## Checking Results

After running a request, check the **Postman Console** (View → Show Postman Console) for:
- `Found torrent: <id> Status: downloaded`
- `Got link from info: https://...`
- `Unrestricted! Direct link: https://...`

Or check the **Variables** tab to see:
- `torrent_id` - The Real-Debrid torrent ID
- `torrent_status` - Status (e.g., "downloaded")
- `first_link` - The hoster link
- `direct_link` - The final direct download link

---

## API Endpoints Covered

| Request | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| Get Torrents List | GET | `/torrents?limit=5000` | List all user torrents |
| Get Torrent Info | GET | `/torrents/info/{id}` | Get detailed torrent info with links |
| Unrestrict Link | POST | `/unrestrict/link` | Convert hoster link to direct link |

---

## Troubleshooting

**"Torrent not found in list"**
- Check that `torrent_hash` variable is correct
- Make sure the torrent was actually added to your RD account

**"No links found in torrent info"**
- The torrent might not be downloaded yet
- Check `torrent_status` - should be "downloaded"

**"No download link found"**
- The unrestrict API call failed
- Check if your RD account is premium
- Verify the link is a supported hoster

---

## Example Variables After Successful Run

```
api_key: "YOUR_API_KEY"
base_url: "https://api.real-debrid.com/rest/1.0"
torrent_hash: "e173ed76a54c425bd556391cec5dea15680861cf"
torrent_id: "ABC123DEF456"
torrent_status: "downloaded"
first_link: "https://real-debrid.com/d/IWZ4QTDUZZ5FW9EC..."
direct_link: "https://110-4.download.real-debrid.com/d/P4QUIBLXSBRMO..."
```

---

**Note:** The actual direct download link will be in `direct_link` variable after successful unrestricting.
