import WrittenReviewContainerStyle from "../../styles/UserReviews/WrittenReviewContainer.module.css";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useClickContext } from "../../misc/ClickContext";
import userIcon from "../../assets/icons/user-icon.svg";

function WrittenReviewContainer({ review }) {
  const { clicked } = useClickContext();

  useEffect(() => {
    console.log("clicked indiv");
  }, [clicked]);

  // review
  // if (amountOfReviews === 0) {
  //   return (
  //     <div className={WrittenReviewContainerStyle["no-reviews"]}>
  //       <span className={WrittenReviewContainerStyle["no-review-text"]}>
  //         No reviews yet
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <Link to={`/${review.username}/rating/${review.albumreviewid}`}>
      <div className={WrittenReviewContainerStyle["reviews-background"]}>
        <div className={WrittenReviewContainerStyle["reviews-container"]}>
          <div className={WrittenReviewContainerStyle["indv-review-container"]}>
            <div className={WrittenReviewContainerStyle["user-info"]}>
              <div className={WrittenReviewContainerStyle["user-img"]}>
                <Link
                  to={`/${review.music.artists.artistid}/album/${review.albumid}`}
                >
                  <img
                    className={
                      WrittenReviewContainerStyle["user-img-in-review"]
                    }
                    src={review.music.coverart}
                    alt={`${review.music.title} album cover`}
                  />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "row",
                }}
              >
                <div
                  className={WrittenReviewContainerStyle["users-review-info"]}
                >
                  <div className={WrittenReviewContainerStyle["users-name"]}>
                    <div
                      className={
                        WrittenReviewContainerStyle["users-name-container"]
                      }
                    >
                      <p
                        className={
                          WrittenReviewContainerStyle["users-name-font"]
                        }
                      >
                        <span className={WrittenReviewContainerStyle["name"]}>
                          {review.music.title}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={WrittenReviewContainerStyle["date-container"]}
                  >
                    <p className={WrittenReviewContainerStyle["date"]}>
                      {review.music.artists.artistName}
                    </p>
                  </div>
                  <div className={WrittenReviewContainerStyle["stars"]}>
                    <StaticStarRating rating={review.starrating} />
                  </div>
                </div>
              </div>
            </div>

            {review.reviewtitle && (
              <div className={WrittenReviewContainerStyle["title-container"]}>
                <p className={WrittenReviewContainerStyle["title"]}>
                  {review.reviewtitle}
                </p>
              </div>
            )}

            {review.reviewbody && (
              <div className={WrittenReviewContainerStyle["text-Review"]}>
                <p className={WrittenReviewContainerStyle["user-review"]}>
                  {review.reviewtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default WrittenReviewContainer;
