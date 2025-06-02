import "../../styles/Album page/ArtistButton.css";

function ArtistButton({ artistPicture, artistName, onClick }) {
  return (
    <div className="artist-profile-name" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="button-boxes">
          <div className="image-container">
            <img
              className="img-artist"
              src={artistPicture}
              alt="Artist profile"
            />
          </div>
          <div className="artist-name-container">
            <p className="artist-name">{artistName}</p>
          </div>
        </div>
    </div>
  );
}

export default ArtistButton;
