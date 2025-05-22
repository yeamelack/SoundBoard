import "../../styles/Album page/ArtistButton.css";

function ArtistButton({ artistPicture, artistName }) {
  return (
    <div className="artist-profile-name">
        <div className="button-boxes">
          <div>
            <img
              className="img-artist"
              src={artistPicture}
              alt="Artist profile"
            />
          </div>
          <div>
            <p className="artist-name">{artistName}</p>
          </div>
        </div>
    </div>
  );
}

export default ArtistButton;
