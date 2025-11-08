# CivicLens

CivicLens is a full-stack demo that improves U.S. policy literacy by scraping federal legislation, simplifying the text with mock AI, and presenting it with a modern React/Vite interface.

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Router DOM, Axios  
- **Backend:** Node.js, Express, TypeScript, CORS  
- **Data:** GovInfo bulk data (BILLSTATUS + BILLS XML) pulled via `scripts/scrape_bills.py`  
- **AI:** Modal-powered summarizer (`modal_app/summarizer.py`) with local extractive fallback (`server/src/utils/ai.ts`)

---

## Features
- Full bill ingestion with complete text, status, tags, and origin metadata.
- AI-style summaries generated on demand for each bill’s detail page.
- Personalized feed + recommendations connected through `/api/recommend`.
- Dark-mode friendly UI with tag chips, gradient hero sections, and rich detail layouts.

---

## Prerequisites
- Node.js 18+
- npm 9+
- Python 3.9+ (for scraping / Modal CLI)
- [Modal](https://modal.com) CLI authenticated with `modal token new` (token already linked to `jessec2`)

---

## Getting Started

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install
```

### Scrape Real Bills
```bash
cd ..
python3 scripts/scrape_bills.py \
  --congresses 118,117 \
  --types hr,s,hjres,sjres \
  --active-limit 6 \
  --passed-limit 6 \
  --max-number 250 \
  --delay 0
```
- Increase `--max-number` or add more bill types for additional coverage.
- If GovInfo rate-limits you, raise `--delay` (e.g., `0.15`) to be polite.

### Optional: Remote AI Summaries via Modal
1. Install the CLI: `pip install modal`
2. Authenticate once: `modal token new` (copy/paste the URL if the browser doesn’t auto-launch)
3. Keep the CLI on your `$PATH` and run the API from the repo root (so `modal_app` is discoverable)
4. Leave `USE_MODAL_SUMMARY` unset (default) or set it to `true` to enable Modal executions
5. To fall back to the local summarizer, export `USE_MODAL_SUMMARY=false`

### Run the Backend API
```bash
cd server
npm run dev
```
- Uses port `3000`. If you see `EADDRINUSE`, free the port (`lsof -i :3000`) or start on another port:
  ```bash
  PORT=3001 npm run dev
  ```

### Run the Frontend
```bash
cd client
npm run dev
```
- Vite serves on `http://localhost:5173` with proxy rules for `/api`.

---

## Project Structure
```
client/            # React + Vite app
  src/
    components/    # Header, cards, filters, tags, recommendation list
    pages/         # Landing, feed, detail, profile
    utils/         # Axios client, tag helpers

server/            # Express + TypeScript API
  src/
    routes/        # /api endpoints
    utils/ai.ts    # Local summarizer fallback
    utils/modal.ts # Spawns Modal CLI for remote summaries
    bills.json     # Scraped data source

scripts/
  scrape_bills.py  # GovInfo scraper + merger

modal_app/
  summarizer.py    # Modal App definition (BART summarizer)
```

---

## Scraper Notes
- Pulls BILLSTATUS XML across multiple congresses, follows the `textVersions` link, and stores the full bill text.
- Adds derived metadata (`status`, `tags`, `excerpt`) so the UI can render meaningful chips and summaries.
- Merge logic updates existing bills by title to avoid duplicates; rerun anytime for fresh data.
- Summaries prefer Modal’s remote BART model when available, then fall back to the local extractive helper.

---

## Future Enhancements
- Replace the mock summarizer with a real LLM endpoint (OpenAI, Claude, etc.).
- Persist scraped data in a database or cache layer instead of flat JSON.
- Add filtering/search, saved lists, and trend analytics to the UI.

Enjoy exploring legislation with CivicLens! 🚀
