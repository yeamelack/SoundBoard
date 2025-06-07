import { useState } from "react";
import "../../styles/Album page/ArtistRatings.css";
import ReviewBox from "../Homepage/ReviewBox";

function ArtistRatings({
  totalRatings = 0,
  averageRating = 0,
  userRating = 0,
  albumInfo,
}) {
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);

  const toggleVisiablity = () => {
    setOverlayVisiablity(!overlayVisiablity);
  };
  return (
    <div className="artist-ratings">
      <div className="artist-ratings-top"></div>
      <div className="artist-ratings-bottom">
        <div className="rating-container">
          <div className="user-rating-container">
            <div className="center-ratings">
              <div className="total-rating">
                <p className="rating-container-text">{totalRatings}</p>
              </div>
              <div className="your-rating">Total ratings</div>
            </div>
          </div>

          <div className="rating-out-of-five-container">
            <div className="center-ratings">
              <div className="total-rating">
                <span className="slash5">{averageRating} / 5</span>
              </div>
              <div className="average-rating">Average rating</div>
            </div>
          </div>

          <div className="total-rating-container">
            <div className="center-ratings">
              <div className="total-rating">
                <span className="slash5">{userRating} / 5</span>
              </div>
              <div className="average-rating">Your rating</div>
            </div>
          </div>
        </div>

        <div className="review-button-container">
          <button className="review-button-artist" onClick={toggleVisiablity}>
            Review
          </button>
          {overlayVisiablity && (
            <div className="overlay">
              <ReviewBox
                result={albumInfo}
                toggleVisiablity={toggleVisiablity}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistRatings;
