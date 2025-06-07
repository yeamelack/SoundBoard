import "../../styles/HomePage/PopularAlbum.css";
import { Link } from "react-router-dom";

function PopularAlbum({ title, artist, imgLink, artistId, albumId }) {
  return (
    <div className="album-container">
      <div className="popular-this-week-album-img-container">
        <Link to={`/${artistId}/album/${albumId}`}>
          <img className="popular-this-week-img" src={imgLink} alt="" />
        </Link>
      </div>
      <div className="album-title-artst-name-container">
        <div className="popular-this-week-album-title-container">
          <Link
            style={{
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "rgb(207, 207, 207)",
            }}
            to={`/${artistId}/album/${albumId}`}
          >
            <span className="popular-this-week-album-title"> {title}</span>
          </Link>
        </div>
        <div className="popular-this-week-artist-container">
          <span className="popular-this-week-artist-name">{artist}</span>
        </div>
      </div>
    </div>
  );
}

export default PopularAlbum;
