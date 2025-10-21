import React from "react";

export default function Track({ track, actionLabel, onAction }) {
  if (!track) return null;

  function handleClick() {
    if (onAction) onAction(track);
  }

 return (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee"
  }}>
    <div>
      <div style={{ fontWeight: "bold" }}>{track.name}</div>
      <div style={{ fontSize: "12px", color: "#666" }}>
        {track.artist} — {track.album}
      </div>
    </div>

    <button onClick={handleClick}>{actionLabel}</button>
  </div>
);
}