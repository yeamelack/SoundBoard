import { useState } from "react";
import "../../styles/Album page/SpotifyReviewButtons.css";
import ReviewBox from "../Homepage/ReviewBox";

function SpotifyReviewButtons({ result, spotifyLink }) {
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisiablity(!overlayVisiablity);
  };
  return (
    <div className="menu-options">
      <div className="write-review-button" onClick={toggleOverlay}>
        <p className="write-review-text">Write a review</p>
      </div>
      {overlayVisiablity && (
        <div className="overlay">
          <ReviewBox result={result} toggleVisiablity={toggleOverlay} />
        </div>
      )}

      <a
        className="listen-on-spotify-button"
        href={spotifyLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="listen-on-spotify-button">Listen on Spotify</p>
      </a>
    </div>
  );
}

export default SpotifyReviewButtons;
