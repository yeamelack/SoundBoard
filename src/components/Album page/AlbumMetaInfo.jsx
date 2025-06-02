import "../../styles/Album page/AlbumMetaInfo.css";

function AlbumMetaInfo({ type, year, trackCount }) {
    return (
      <div className="album-info">
        <p className="album-info-text">{type}</p>
        <p className="album-info-text-point"> • </p>
        <p className="album-info-text">{year}</p>
        <p className="album-info-text-point"> • </p>
        <p className="album-info-text">{trackCount} tracks</p>
      </div>
    );
  }
  
  export default AlbumMetaInfo;