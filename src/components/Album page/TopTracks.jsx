import "../../styles/Album page/TopTracks.css";

function TopTrack({ trackList }) {
  return (
    <div className="track-list-container">
      <div className="indv-track-container">
        {Array.from({ length: trackList.total }, (_, i) => (
          <div className="tracks" key={i}>
            <div className="track-number">
              <p>{i + 1}</p>
            </div>
            <div className="track-title-container">
              <span className="title-title">{trackList.items[i].name}</span>
            </div>
            <div className="track-rating">
              <p>rating</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopTrack;
