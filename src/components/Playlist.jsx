import React from "react";
import TrackList from "./TrackList";

export default function Playlist({ name, tracks = [], onNameChange, onRemove, onSave }) {
  const hasTracks = Array.isArray(tracks) && tracks.length > 0;

  return (
<section>
  <h2>Your Playlist</h2>
  <input
    value={name}
    onChange={(e) => onNameChange && onNameChange(e.target.value)}
    placeholder="New Playlist"
    aria-label="Playlist name"
  />
  {hasTracks ? (
    <TrackList tracks={tracks} actionLabel="−" onAction={onRemove} />
  ) : (
    <p style={{ opacity: 0.7, marginTop: 8 }}>Add songs with “+” from Search Results.</p>
  )}
  <button onClick={onSave} disabled={!hasTracks}>
    Save to Spotify
  </button>
</section>

  );
}

