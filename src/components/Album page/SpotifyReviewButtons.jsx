import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/Album page/SpotifyReviewButtons.css";
import ReviewBox from "../Homepage/ReviewBox";

function SpotifyReviewButtons({ result, spotifyLink }) {
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const { isAuthenticated, loginWithPopup } = useAuth0();

  const handleClick = () => {
    if (isAuthenticated) {
      setOverlayVisiablity(!overlayVisiablity);
    } else {
      loginWithPopup();
    }
  };

  return (
    <div className="menu-options">
      <div
        className="write-review-button"
        onClick={handleClick}
        style={{
          cursor: "pointer",
          opacity: isAuthenticated ? 1 : 0.8,
        }}
      >
        <p className="write-review-text">
          {isAuthenticated ? "Write a review" : "Login to write a review"}
        </p>
      </div>

      {overlayVisiablity && (
        <div className="overlay">
          <ReviewBox result={result} toggleVisiablity={handleClick} />
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
