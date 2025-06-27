import "../../styles/Album page/AlbumMetaInfo.css";

function AlbumMetaInfo({ type, year, trackCount }) {
  return (
    <>

      <p className="album-info-text">{type}</p>
      <p className="album-info-text-point"> • </p>
      <p className="album-info-text">{year}</p>
      <p className="album-info-text-point"> • </p>
      <p className="album-info-text">{trackCount} tracks</p>
    </>
  );
}

export default AlbumMetaInfo;
