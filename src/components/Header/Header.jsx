import "../../styles/Header/Header.css";
import SuggestionDropdown from "../Header/SuggestionDropdown.jsx";
import SearchBar from "../Header/SearchBar.jsx";
import ReviewButton from "./ReviewButton.jsx";
import UserButton from "./UserButton.jsx";
import SearchButton from "./SearchButton.jsx";
import Logo from "./Logo.jsx";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect, useRef } from "react";
import LoginButton from "./LoginButton.jsx";
import { Link } from "react-router-dom";


function Header() {
  const { isAuthenticated } = useAuth0();

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
    }, 250);

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
      <Link to="/">
        {" "}
        <div className="left-section">
          <Logo />
        </div>
      </Link>

      <div className="middle-section">
        <SearchBar
          value={searchInput}
          onChange={getSearchInput}
          onFocus={handleInputFocus}
          inputRef={searchInputRef}
          className="search-bar"
          placeholder="Search"
        />
        <SearchButton />

        {isDropdownVisible &&
          searchInput.trim().length > 0 &&
          searchResults.length > 0 && (
            <SuggestionDropdown
              results={searchResults}
              onClick={handleSuggestionClick}
              dropdownRef={dropdownRef}
              className="suggestions-dropdown"
              route="album page"
            />
          )}
      </div>
      <div
        className={
          isAuthenticated
            ? "right-section-logged-in"
            : "right-section-logged-out"
        }
      >
        {isAuthenticated ? (
          <>
            <LogoutButton />
            <ReviewButton />
            <UserButton />
          </>
        ) : (
          <LoginButton />
        )}{" "}
      </div>
    </div>
  );
}

export default Header;
