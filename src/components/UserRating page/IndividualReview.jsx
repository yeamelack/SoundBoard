import "../../styles/Album page/UsersReviews.css";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useClickContext } from "../../misc/ClickContext";

function IndividualReview({
  username,
  date,
  rating,
  title,
  review,
  profilePic,
  amountOfReviews,
}) {
  const { clicked } = useClickContext();
  useEffect(() => {
    console.log("clicked indiv");
  }, [clicked]);

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
                <Link to={`/${username}`}>
                  <img
                    className="user-img-in-review"
                    src={profilePic}
                    alt="User profile picture"
                  />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <div className="users-review-info">
                  <div className="users-name">
                    <p className="users-name-font">
                      Reviewed by <span className="name">{username}</span>
                    </p>
                  </div>
                  <p className="date"> {date}</p>
                  <div className="stars">
                    <StaticStarRating rating={rating} />
                  </div>
                </div>
              </div>
            </div>
            {title && (
              <div className="title-container">
                <p className="title">{title}</p>
              </div>
            )}

            {review && (
              <div className="text-Review">
                <p className="user-review">{review}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IndividualReview;
