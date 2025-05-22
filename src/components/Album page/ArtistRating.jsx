import "../../styles/Album page/ArtistRatings.css"; 

function ArtistRatings({
  totalRatings = 0,
  averageRating = 0,
  userRating = 0,
  onReviewClick,
}) {
  return (
    <div className="artist-ratings">
      <div className="artist-ratings-top"></div>
      <div className="artist-ratings-bottom">
        <div className="rating-container">
          <div className="user-rating-container">
            <div className="center-ratings">
              <div className="total-rating">
                <p className="rating-container-text">{totalRatings}</p>
              </div>
              <div className="your-rating">Total ratings</div>
            </div>
          </div>

          <div className="rating-out-of-five-container">
            <div className="center-ratings">
              <div className="rating-out-of-five">
                <span className="slash5"> {averageRating} / 5</span>
              </div>
              <div className="average-rating">Average rating</div>
            </div>
          </div>

          <div className="total-rating-container">
            <div className="center-ratings">
              <div className="rating-out-of-five">
                <div className="user-rating">
                  <span className="slash5"> {userRating} / 5</span>
                </div>
                <div className="average-rating">Your rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="review-button-container">
          <button className="review-button-artist">Review</button>
        </div>
      </div>
    </div>
  );
}

export default ArtistRatings;
