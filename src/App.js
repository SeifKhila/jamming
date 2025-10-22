import React, { useState } from "react";            // ← no useEffect needed
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import Spotify from "./util/Spotify";
// at the top of App.js
import { MOCK_TRACKS } from "./data/mockTracks";
import './App.css';

const USE_SPOTIFY = true; // set to true later when you want to retry the API

function mockSearch(term) {
  const q = (term || "").trim().toLowerCase();
  if (!q) return [];
  return MOCK_TRACKS.filter(t => t.name.toLowerCase().includes(q));
}


export default function App() {
  // ----- STATE -----
  const [searchResults, setSearchResults] = useState([]);          // ← start empty
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // ----- HANDLERS -----
  function addTrack(track) {
    if (playlistTracks.some((t) => t.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  }

  function removeTrack(track) {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  }

// In App.js — replace your current handleSearch with this
async function handleSearch(term) {
  const q = (term || "").trim();
  if (!q) { setSearchResults([]); return; }

  if (!USE_SPOTIFY) {
    setSearchResults(mockSearch(q));
    return;
  }

  // live path (for later)
  const token = Spotify.getAccessToken();
  if (!token) return;
  const results = await Spotify.search(q);
  setSearchResults(results);
}



  // Save playlist to user’s account
  async function savePlaylist() {
    const uris = playlistTracks.map((t) => t.uri);
    const ok = await Spotify.savePlaylist(playlistName, uris);
    if (ok) {
      alert(`Saved playlist: ${playlistName} (${uris.length} tracks)`);
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    } else {
      alert("Saving failed. Please try again.");
    }
  }

  // ----- RENDER -----
  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Jammming</h1>

      <SearchBar onSearch={handleSearch} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
        <SearchResults tracks={searchResults} onAdd={addTrack} />
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onNameChange={setPlaylistName}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

