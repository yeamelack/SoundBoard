import Header from "../components/Header/Header";
import "../styles/HomePage/HomePage.css";
import PopularThisWeek from "../components/Homepage/PopularThisWeek.jsx";
import ReviewBoxSearch from "../components/Homepage/ReviewBoxSearch.jsx";
import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import supabase from "../supabase/supabaseClient";

function HomePage() {
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
    if (typeof suggestion === "string") {
      setSearchInput(suggestion);
    } else {
      setSearchInput("");
    }
    setSearchResults([]);
    setIsDropdownVisible(false);
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
    <div className="homepage-grid">
      <div>
        <Header />
      </div>

      {isAuthenticated && (
        <div className="quick-search-homepage">
          <ReviewBoxSearch
            searchInput={searchInput}
            currentSearch={getSearchInput}
            searchResults={searchResults}
            onClick={handleSuggestionClick}
            className="review-box-default-container"
          />
        </div>
      )}

      <div className="popular-this-week">
        <PopularThisWeek />
      </div>
    </div>
  );
}

export default HomePage;
