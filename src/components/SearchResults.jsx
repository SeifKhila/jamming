import React from "react";
import TrackList from "./TrackList";

export default function SearchResults({ tracks = [], onAdd }) {
  return (
    <section>
      <h2>Search Results</h2>
<p>({tracks.length} tracks)</p>
{tracks.length === 0 && <p style={{opacity:.7}}>No results yet — try a search.</p>}
<TrackList tracks={tracks} actionLabel="+" onAction={onAdd} />
</section>
  );
}
