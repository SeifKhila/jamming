# Jammming

Jammming is a React web app that lets users search for songs, build a custom playlist, and (in live mode) save it to their Spotify account.

> This repo currently runs in **mock mode** (no login required) using local sample data.  
> The **Spotify live mode** is already coded and can be enabled once the Spotify Dashboard + redirect URI are configured.

---

## 🎯 Purpose

- Practice React: components, props, state, unidirectional data flow.
- Work with real-world APIs (Spotify Web API) including auth & requests.
- Build user features: search, add/remove tracks, rename playlist, save.

---

## 🧰 Tech Stack

- **React** (functional components + hooks)
- **CSS** (light theming + background image)
- **Spotify Web API** (search tracks, create playlist, add tracks) — live mode
- **Create React App** (or your local setup)
- **Node / npm**

---

## 🚀 Features (implemented)

- Search bar accepts a term and shows matching tracks (mock mode).
- Results list shows **name / artist / album**.
- Add a track to the playlist with **+**, no duplicates.
- Remove a track from the playlist with **−**.
- Rename playlist title inline.
- “Save to Spotify”:
  - **Mock mode**: shows a confirmation alert and resets the playlist.
  - **Live mode**: creates a playlist in your Spotify account and adds the tracks (requires access token).

---

## 🗂️ Project Structure (key files)


src/
App.js
index.css
data/
mockTracks.js
util/
Spotify.js # auth + search + save playlist (live mode)
components/
SearchBar.jsx
SearchResults.jsx
TrackList.jsx
Track.jsx
Playlist.jsx
assets/
background.png # custom background image


---

## 🧪 Modes

### Mock Mode (default)
- No login required.
- Local dataset used for searching (`src/data/mockTracks.js`).
- In `App.js`, the flag is:
  ```js
  const USE_SPOTIFY = false;
