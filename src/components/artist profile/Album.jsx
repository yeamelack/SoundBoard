import "../../styles/artist profile/popular-this-week.css";
import "../../styles/artist profile/discog-page.css";

const Album = ({ imageSrc, title, artist, variant = "default" }) => {
    const isDiscography = variant === "discography";
  
    return (
      <div className={isDiscography ? "indv-discography-grid" : "indv-grid-column2"}>
        <div className={isDiscography ? "img-container" : "img-grid"}>
          <img
            className={isDiscography ? "discog-img" : "pop-img"}
            src={imageSrc}
            alt=""
          />
        </div>
  
        <div className={isDiscography ? "discog-album-title" : ""}>
          <p className={isDiscography ? "discog-album-title" : "album-title"}>{title}</p>
          {!isDiscography && <p className="album-title">{artist}</p>}
        </div>
      </div>
    );
  };
  
  export default Album;