import "../../styles/Album page/AlbumPageNavigationBar.css";
import { useClickContext } from "../../misc/ClickContext";

function AlbumPageNavigationBar({ setShowReviews, showReviews }) {
  const { setClickInfo } = useClickContext();

  const handleReviewClick = () => {
    setClickInfo({ clicked: false });
    setShowReviews(true);
    setClickInfo({ clicked: true, source: "review-nav-button" });
  };

  return (
    <div className="artist-page-navbar">
      <div className="home-button-grid">
        <div className="button-container">
          <div className="home-nav-button-container">
            <button
              className={`home-button ${!showReviews ? "active-tab" : ""}`}
              onClick={() => setShowReviews(false)}
            >
              Home
            </button>
          </div>
        </div>
      </div>
      <div className="home-button-grid">
        <div className="button-container">
          <div className="home-nav-button-container">
            <button
              className={`review-nav-button ${showReviews ? "active-tab" : ""}`}
              onClick={handleReviewClick}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumPageNavigationBar;
