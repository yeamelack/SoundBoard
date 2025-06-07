import "../../styles/Album page/AlbumTitle.css";

function AlbumTitle({ title }) {
  return (
    <div className="album-name-text">
      <p className="album-title-text">{title}</p>
    </div>
  );
}

export default AlbumTitle;
