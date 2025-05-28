import "../../styles/Album page/TopTracks.css";
import { useState } from "react";

function TopTrack({ trackList }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="track-list-container">
      <div className="indv-track-container">
        {(trackList.total >= 7 && showMore
          ? Array.from({ length: trackList.total })
          : Array.from({ length: Math.min(7, trackList.total) })
        ).map((_, i) => (
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

      {trackList.total > 7 && (
        <div className="show-more-button-container">
          <button className="show-more-button" onClick={toggleShowMore}>
            {showMore ? (
              <span className="Show-More-Text">Show Less</span>
            ) : (
              <span className="Show-Less-Text">Show More</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default TopTrack;
