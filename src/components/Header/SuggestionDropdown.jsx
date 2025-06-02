import React from "react";
import "../../styles/Header/SuggestionDropdown.css";
import { Link } from "react-router-dom";

function SuggestionDropdown({ results, onClick, dropdownRef }) {
  return (
    <div ref={dropdownRef} className="suggestions-dropdown">
      {results.map((result, index) => (
        <Link key={result.id} to={`/${result.artists[0].id}/album/${result.id}`}>
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
                {result.isExplicit && <span className="explicit-tag">E</span>}
              </div>
              <div className="suggested-result-artist-name">
                <span className="suggested-result-font-artist">
                  {result.artists[0].name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SuggestionDropdown;
