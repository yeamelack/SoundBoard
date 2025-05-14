import searchIcon from "../assets/icons/search-icon.svg";
import userIcon from "../assets/icons/user-icon.svg";
import "../styles/Header.css";
import React, { useState, useEffect } from "react";

function Header() {
  const [searchInput, setSearchInput] = useState("");

  const getSearchInput = (event) => {
    console.log(event.target.value);
    return setSearchInput(event.target.value);
  };

  //useEffect to handle querying in search

  return (
    <div className="header">
      <div className="left-section">
        <div className="logo-container">
          <p className="logo">LOGO GOES HERE</p>
        </div>
      </div>
      <div className="middle-section">
        <input
          className="search-bar"
          type="search"
          placeholder="Search"
          onChange={getSearchInput}
        />
        <button className="search-button">
          <img className="search-icon" src={searchIcon} alt="Search" />
        </button>
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
