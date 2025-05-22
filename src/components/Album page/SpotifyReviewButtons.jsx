import "../../styles/Album page/SpotifyReviewButtons.css";

function SpotifyReviewButtons({ spotifyLink }) {
  return (
    <div className="menu-options">
      <div className="write-review-button">
        <p className="write-review-text">Write a review</p>
      </div>
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
