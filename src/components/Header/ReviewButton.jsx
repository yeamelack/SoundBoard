import React, { useState, useEffect, useRef } from "react";
import ReviewBoxSearch from "../Homepage/ReviewBoxSearch";
import "../../styles/Header/ReviewButton.css";
import CancelButton from "../../assets/icons/cancel-button.svg";

function ReviewButton() {
  const [overlayVisibility, setOverlayVisibility] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
        setSearchResults([]);
      }
    }, 150);

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

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const toggleOverlay = () => {
    setOverlayVisibility(!overlayVisibility);
  };

  return (
    <>
      <div className="review-button-container" onClick={toggleOverlay}>
        <button className="review-button">
          <p className="review-button-text">Review</p>
        </button>
      </div>

      {overlayVisibility && (
        <div className="overlay" >
          <ReviewBoxSearch
            searchInput={searchInput}
            currentSearch={getSearchInput}
            searchResults={searchResults}
            onClick={handleSuggestionClick}
            className="review-box-default-header-container"
          />
          <div
            className="cancel-button-in-overlay-container"
            onClick={toggleOverlay}

          >
            <img
              className="cancel-button-overlay"
              src={CancelButton}
              alt="cancel button"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewButton;
