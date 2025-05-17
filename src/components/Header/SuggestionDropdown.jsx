import React from "react";
import "../../styles/Header/SuggestionDropdown.css";

function SuggestionDropdown({ results, onClick, dropdownRef }) {
  return (
    <div ref={dropdownRef} className="suggestions-dropdown">
      {results.map((result, index) => (
        <div
          key={index}
          className="suggestion-item"
          onClick={() => onClick(result.name)}
        >
          <div className="search-img-container">
            <img className="search-img" src={result.images[0].url} alt="" />
          </div>
          <div className="search-suggestions-titles-container">
            <div className="suggested-result-album-title">
              <span className="suggested-result-font">{result.name}</span>
            </div>
            <div className="suggested-result-artist-name">
              <span className="suggested-result-font-artist">
                {result.artists[0]?.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SuggestionDropdown;
