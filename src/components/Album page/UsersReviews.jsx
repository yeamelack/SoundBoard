import "../../styles/Album page/UsersReviews.css";

function UsersReviews({ username, date, rating, review, profilePic, amountOfReviews }) {
  if (amountOfReviews === 0) {
    return (
      <div className="no-reviews">
        <span className="no-review-text">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="reviews-background">
      {[...Array(amountOfReviews)].map((_, i) => (
        <div className="reviews-container" key={i}>
          <div className="indv-review-container">
            <div className="user-info">
              <div className="user-img">
                <img
                  className="user-img-in-review"
                  src={profilePic}
                  alt="User"
                />
              </div>
              <div className="users-review-info">
                <div className="users-name">
                  <p className="users-name-font">Reviewed by </p>
                  <p className="name"> {username}</p>
                </div>
                <p className="date"> {date}</p>
                <div className="stars">{rating}</div>
              </div>
            </div>
            <div className="title-container">
              <p className="title">Best Album EVER</p>
            </div>

            <div className="text-Review">
              <p className="user-review">
                {review}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersReviews;
