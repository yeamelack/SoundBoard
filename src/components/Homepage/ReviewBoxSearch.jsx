import "../../styles/HomePage/ReviewBoxSearch.css";
import SearchBar from "../../components/Header/SearchBar";
import SuggestionDropdown from "../Header/SuggestionDropdown";
import "../../styles/HomePage/DropDownInReview.css";
import React, { useState, useEffect } from "react";
import ReviewBox from "./ReviewBox"; // your component

function ReviewBoxSearch({
  searchInput,
  currentSearch,
  searchResults,
  onClick,
  className,
}) {
  const [popUpState, setPopUpState] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePopUp = (result) => {
    setSelectedItem({
      artistid: result.artists[0].id,
      title: result.name,
      coverart: result.images[0].url,
    });
    setPopUpState(true);
  };
  const closePopUp = () => {
    setSelectedItem(null);
    setPopUpState(false);
  };

  useEffect(() => {
    if (popUpState && selectedItem) {
      onClick(false);
    }
  }, [popUpState, selectedItem]);

  return (
    <div className={className}>
      <SearchBar
        className="review-box-search"
        placeholder="What have you been listening to?"
        value={searchInput}
        onChange={currentSearch}
      />
      <div style={{ position: "absolute" }}>
        {" "}
        {searchResults.length > 0 && (
          <SuggestionDropdown
            results={searchResults}
            onClick={onClick}
            className="suggestions-dropdown-in-review"
            popUpOnClick={handlePopUp}
            route="quick review"
          />
        )}
        <div style={{ position: "relative" }}>
          {popUpState && selectedItem && (
            <ReviewBox result={selectedItem} onClick={onClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewBoxSearch;
