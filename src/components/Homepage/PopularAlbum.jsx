import "../../styles/HomePage/PopularAlbum.css"


function PopularAlbum({ title, artist, imgLink }) {
  return (
    <div className="popular-album">
      <div className="album-img">
        <img className ="img" src={imgLink} alt="" />
      </div>
      <div>
        <span>{title}</span>
      </div>
      <div className="artist-name">
        <span> {artist}</span>
      </div>
    </div>
  );
}

export default PopularAlbum;
