import SuggestionDropdown from "../Header/SuggestionDropdown.jsx";
import SearchBar from "../Header/SearchBar.jsx";
import ChartButton from "../Header/ChartButton.jsx";
import ReviewButton from "./ReviewButton.jsx";
import UserButton from "./UserButton.jsx";
import SearchButton from "./SearchButton.jsx";
import Logo from "./Logo.jsx";
import "../../styles/Header/Header.css";
import React, { useState, useEffect, useRef } from "react";

function Header() {
  //capture user search input
  const [searchInput, setSearchInput] = useState("");

  //store results from API calls
  const [searchResults, setSearchResults] = useState([]);

  //keeps track of search dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const getSearchInput = (event) => {
    setSearchInput(event.target.value);
    setIsDropdownVisible(true);
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
        <Logo />
      </div>
      <div className="middle-section">
        <SearchBar
          value={searchInput}
          onChange={getSearchInput}
          onFocus={handleInputFocus}
          inputRef={searchInputRef}
        />
        <SearchButton />
        {isDropdownVisible &&
          searchInput.trim().length > 0 &&
          searchResults.length > 0 && (
            <SuggestionDropdown
              results={searchResults}
              onClick={handleSuggestionClick}
              dropdownRef={dropdownRef}
            />
          )}
      </div>
      <div className="right-section">
        <ChartButton />
        <ReviewButton />
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
