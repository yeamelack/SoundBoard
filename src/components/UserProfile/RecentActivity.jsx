import RecentActivityAlbums from "../../components/UserProfile/RecentActivityAlbums.jsx";
import "../../styles/UserProfile/RecentActivity.css";
function RecentActivity() {
  return (
    <div className="recent-activity-container">
      <div className="recent-activity">
        <RecentActivityAlbums title="pop"rating="11" imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411" />
        <RecentActivityAlbums />

      </div>
    </div>
  );
}

export default RecentActivity;
