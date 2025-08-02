import "../../styles/artist profile/popular-this-week.css";
import "../../styles/artist profile/discog-page.css";
import { Link } from "react-router-dom";

const Album = ({ imageSrc, title, artist, artistId, albumId, variant = "default" }) => {
    const isDiscography = variant === "discography";
    // if (!artistId || !albumId) return null;
    return (
      <div className="discography-page">
        <div className={isDiscography ? "indv-discography-grid" : "indv-grid-column2"}>
        <Link to={`/${artistId}/album/${albumId}`}>
          <div className={isDiscography ? "img-container" : "img-grid"}>
            <img
              className={isDiscography ? "discog-img" : "pop-img"}
              src={imageSrc}
              alt=""
            />
          </div>
    
          <div className={isDiscography ? "discog-album-title-wrapper" : ""}>
            <p className={isDiscography ? "discog-album-title" : "album-title"}>{title}</p>
            {!isDiscography && <p className="album-title">{artist}</p>}
          </div>
        </Link>
        </div>
      </div>
      
    );
  };
  
  export default Album;

