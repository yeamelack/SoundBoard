import "../../styles/UserProfile/RecentActivityAlbums.css";

function RecentActivityAlbums({ imgLink, title, rating }) {
  return (
    <div className="indv-recent-activity">
      <div className="recent-activity-img-container">
        <img
          className="recent-activity-img"
          src={imgLink}
          alt={`${title} album cover.`}
        />
      </div>
      <div className="recent-activity-album-name-container">
        <span className="recent-activity-album-name">{title}</span>
      </div>
      <div className="recent-activity-user-rating-container">
        <span className="recent-activity-user-rating">{rating}</span>
      </div>
    </div>
  );
}

export default RecentActivityAlbums;
