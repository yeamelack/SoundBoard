import "../../styles/Rating/RatedAlbums.css";
import ArtistButton from "../Album page/ArtistButton";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";

function RatedAlbums(review) {
  if (!review) {
    return <div>loading....</div>;
  }

  review = review.review;

  return (
    <div>
      <div className="rated-album-container">
        <Link to={`/${review.music.artists.artistid}/album/${review.albumid}`}>
          <div className="rated-album-image-container">
            <img
              className="rated-album-img"
              src={review.music.coverart}
              alt={`${review.music.title} cover art`}
            />
          </div>
        </Link>

        <div className="album-information-container">
          <div className="album-information-title-container">
            <span className="album-information-title">
              {review.music.title}
            </span>
          </div>
          <div>
            <ArtistButton
              artistPicture={review.music.artists.profilepic}
              artistName={review.music.artists.artistName}
            />
          </div>
        </div>
        <div className="star-rating-review-button-container">
          <div className="star-rating-container">
            <StaticStarRating size="22px" rating={review.starrating} />
          </div>
          <div style={{ height: "100%" }}>
            <Link to={`${review.albumreviewid}`}>
              <button className="see-review-button">
                <span className="see-review-text"> See Review </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatedAlbums;
