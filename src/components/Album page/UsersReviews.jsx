import "../../styles/Album page/UsersReviews.css";

function UsersReviews({ amountOfReviews }) {
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
                  src="artist-profile/ab6761610000e5eb43633ee607e147dfd024a198.jpeg"
                  alt="User"
                />
              </div>
              <div className="users-review-info">
                <div className="users-name">
                  <p className="users-name-font">Reviewed by</p>
                  <p className="name">Name</p>
                </div>
                <p className="date">listened on 3 oct 2024</p>
              </div>
            </div>
            <div className="title-container">
              <p className="title">Best Album EVER</p>
            </div>
            <div className="stars">stars</div>
            <div className="text-Review">
              <p className="user-review">
                The Flag is Raised... (review content here)
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersReviews;
