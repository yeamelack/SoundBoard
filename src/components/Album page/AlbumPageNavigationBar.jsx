import "../../styles/Album page/AlbumPageNavigationBar.css";

function AlbumPageNavigationBar({ setShowReviews, showReviews }) {
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
              onClick={() => setShowReviews(true)}
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
