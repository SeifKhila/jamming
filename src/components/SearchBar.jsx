import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");
  return (
    <div>
      <input
        placeholder="Enter a song title"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button
        onClick={() => {
          console.log("[SearchBar] clicking Search with term:", term);
          onSearch && onSearch(term);
        }}
      >
        Search
      </button>
    </div>
  );
}

