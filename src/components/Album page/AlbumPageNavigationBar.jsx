import "../../styles/Album page/AlbumPageNavigationBar.css";

function AlbumPageNavigationBar() {
  return (
    <div className="artist-page-navbar">
      <div className="home-button-grid">
        <div className="button-container">
          <div className="home-nav-button-container">
            <button className="home-button">Home</button>
          </div>
        </div>
        <div className="underglow"></div>
      </div>
      <div className="home-button-grid">
        <div className="button-container">
          <div className="home-nav-button-container">
            <button className="review-nav-button">Reviews</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumPageNavigationBar;
