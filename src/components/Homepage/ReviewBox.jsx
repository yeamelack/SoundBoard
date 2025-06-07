import "../../styles/HomePage/ReviewBox.css";
import CancelButton from "../../assets/icons/cancel-button.svg";

import RatingReview from "./RatingReview.jsx";
import { useState, useEffect } from "react";
import React from "react";

function ReviewBox({ result, toggleVisiablity }) {
  const [rating, setRating] = useState(0);
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);

  useEffect(() => {
    if (result) {
      setOverlayVisiablity(true);
    }
  }, [result]);

  const closeOverlay = () => {
    setOverlayVisiablity(false);
    setRating(0);
    if (typeof toggleVisiablity === "function") {
      toggleVisiablity();
    }
  };

  return (
    <>
      {overlayVisiablity && (
        <div className="overlay">
          <div className="review-box-container">
            <div className="above-text-box">
              <div className="review-box-album-info">
                <div className="review-box-album-img-container">
                  <img
                    className="review-box-album-img"
                    src={result.images[0].url}
                    alt={`${result.name} album cover.`}
                  />
                </div>

                <div className="review-box-album-title-artist-container">
                  <div className="review-box-album-title-text-container">
                    <span className="review-box-album-title-text">
                      {result.name}
                    </span>
                  </div>

                  <div className="review-box-artist-name-text-container">
                    <span className="review-box-artist-name-text">
                      {result.artists[0].name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-stars-container">
                <RatingReview rating={rating} setRating={setRating} />
              </div>

              <div className="cancel-button-container" onClick={closeOverlay}>
                <img
                  className="cancel-button"
                  src={CancelButton}
                  alt="cancel-button"
                />
              </div>
            </div>

            <div className="review-container">
              <div className="title-container">
                <textarea
                  className="title-textbox"
                  placeholder="Add a title"
                ></textarea>
              </div>

              <div className="review-text-container">
                <textarea
                  className="review-textbox"
                  placeholder="Add a review"
                ></textarea>
              </div>
            </div>

            <div className="review-box-sumbit-button-container">
              <button className="review-submit-button">Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewBox;
