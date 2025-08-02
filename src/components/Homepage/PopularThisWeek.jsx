import PopularAlbum from "../../components/Homepage/PopularAlbum.jsx";
import "../../styles/HomePage/PopularThisWeek.css";
import React, { useState, useEffect, useRef } from "react";

function PopularThisWeek() {
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    const url = `http://localhost:8484/newrelease`;
    async function fetchAlbums() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setNewReleases(json);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchAlbums();
  });

  return (
    <div>
      <div className="popular-this-week-title-container">
        <span className="popular-this-week-title"> Popular this week</span>
      </div>

      <div className="popular-this-week-container">
        <div className="center">
          <div className="popular-albums-flex-box">
            {newReleases.slice(0, 7).map((value, i) => (
              <PopularAlbum
                key={value.id}
                artist={value.artists[0].name}
                imgLink={value.images[2].url}
                title={value.name}
                artistId={value.artists[0].id}
                albumId={value.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularThisWeek;
