import "../../styles/Album page/AlbumArt.css";
function AlbumArt({ artLink, albumName }) {
  return (
    <div className="album-img-container">
      <img className="img" src={artLink} alt={`${albumName} album cover`}></img>
    </div>
  );
}

export default AlbumArt;
