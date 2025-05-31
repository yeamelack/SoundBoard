import React from "react";
import "../../styles/Header/SuggestionDropdown.css";
import { Link } from "react-router-dom";

function SuggestionDropdown({
  results,
  onClick,
  dropdownRef,
  className,
  route,
  popUpOnClick,
}) {
  function getRoute(route, results) {
    console.log("getRoute called with:", route, results);
    console.log(`/${results.artists?.[0]?.id}/album/${results.id}`);

    if (route === "album page") {
      return `/${results.artists?.[0]?.id}/album/${results.id}`;
    } else if (route === "quick review") {
      return `/artist/${results.artists?.[0]?.id}`;
    } else {
      return `/unknown`;
    }
  }

  return (
    <div ref={dropdownRef} className={className}>
      {results.map((result, index) => (
        <Link
          key={result.id}
          to={getRoute(route, result)}
          onClick={(e) => {
            if (route === "quick review") {
              e.preventDefault();
              popUpOnClick(result);
            }
          }}
        >
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
