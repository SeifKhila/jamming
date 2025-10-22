// src/components/SearchBar/SearchBar.js
import React, { useState, useCallback } from "react";


const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleTermChange = useCallback((e) => setTerm(e.target.value), []);
  const search = useCallback(() => {
    if (term.trim()) onSearch(term.trim());
  }, [term, onSearch]);
  const handleKeyDown = (e) => e.key === "Enter" && search();

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Enter a song, artist, or album"
        value={term}
        onChange={handleTermChange}
        onKeyDown={handleKeyDown}
      />
      <button className="SearchButton" type="button" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;

