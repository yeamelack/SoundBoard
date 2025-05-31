import "../../styles/Album page/MoreFromSection.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MoreFromSection({ artistId, albumId, artistAlbums }) {
  return (
    <div className="more-from">
      <div className="more-from-background">
        {artistAlbums
          .filter((album) => album.id !== albumId)
          .slice(0, 5)
          .map((album) => (
            <Link to={`/${artistId}/album/${album.id}`} key={album.id}>
              <div className="indv-from-more-grid">
                <div className="grid-inside-indv">
                  <div className="img-container-more-from">
                    <img
                      className="img-inside-more-from"
                      src={album.images[1]?.url}
                      alt={`More from ${album.artists[0]?.name}`}
                    />
                  </div>
                  <div className="right-of-img">
                    <div className="more-from-album-title">{album.name}</div>
                    <div className="more-from-album-year">
                      Album • {new Date(album.release_date).getFullYear()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default MoreFromSection;
