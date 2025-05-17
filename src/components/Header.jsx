import searchIcon from "../assets/icons/search-icon.svg";
import userIcon from "../assets/icons/user-icon.svg";
import "../styles/Header.css";
import React, { useState, useEffect, useRef } from "react";

function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const getSearchInput = (event) => {
    console.log(event.target.value);
    setSearchInput(event.target.value);
    setIsDropdownVisible(true); // Show the dropdown when user types
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput) {
        fetch(`http://localhost:8484/search?q=${searchInput}`)
          .then((response) => response.json())
          .then((json) => setSearchResults(json))
          .catch((error) => console.error("Error fetching data:", error));
      } else {
        setSearchResults([]); // Clear results when input is empty
      }
    }, 150);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setSearchResults([]); // Clear suggestions after selection
    setIsDropdownVisible(false); // Close dropdown after selection
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setIsDropdownVisible(false); // Close dropdown if click is outside
    }
  };

  useEffect(() => {
    // Add event listener on mount
    document.addEventListener("click", handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    // Show the dropdown when the input is focused
    if (searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  return (
    <div className="header">
      <div className="left-section">
        <div className="logo-container">
          <p className="logo">LOGO GOES HERE</p>
        </div>
      </div>
      <div className="middle-section">
        <input
          ref={searchInputRef} // Assign ref to the search input
          className="search-bar"
          type="search"
          placeholder="Search"
          onChange={getSearchInput}
          value={searchInput}
          onFocus={handleInputFocus}
        />
        <button className="search-button">
          <img className="search-icon" src={searchIcon} alt="Search" />
        </button>
        {isDropdownVisible && searchResults.length > 0 && (
          <div ref={dropdownRef} className="suggestions-dropdown">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(result.name)}
              >
                <div className="search-img-container">
                  <img
                    className="search-img"
                    src={result.images[0].url}
                    alt=""
                  />
                </div>

                <div className="search-suggestions-titles-container">
                  <div className="suggested-result-album-title">
                    <span className="suggested-result-font">{result.name}</span>
                  </div>
                  <div className="suggested-result-artist-name">
                    <span className="suggested-result-font">
                      {result.artists[0].name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="right-section">
        <div className="chart-button-container">
          <button className="chart-button">
            <p className="button-text">Charts</p>
          </button>
        </div>
        <div className="review-button-container">
          <button className="review-button">
            <p className="button-text">Review</p>
          </button>
        </div>
        <div className="user-button-container">
          <button className="user-button">
            <div className="user-icon-container">
              <img className="user-icon" src={userIcon} alt="User" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
