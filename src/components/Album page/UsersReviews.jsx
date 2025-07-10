import "../../styles/Album page/UsersReviews.css";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";
import { useClickContext } from "../../misc/ClickContext";
import { click } from "@testing-library/user-event/dist/click";
import userIcon from "../../assets/icons/user-icon.svg";

function UsersReviews({ limit, albumId, setDisplayedReviews, updatedReview }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!updatedReview) return;

    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.albumreviewid === updatedReview.albumreviewid ? updatedReview : r
      )
    );
  }, [updatedReview]);

  useEffect(() => {
    const getReviewsWithUserInfo = async () => {
      const { data: reviews, error: reviewError } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("albumid", albumId)
        .limit(limit)
        .order("date", { ascending: false });

      if (reviewError) {
        console.error("error fetching reviews: ", reviewError);
        return;
      }

      // console.log("reviews");
      // console.log(reviews);

      const enrichedReviews = await Promise.all(
        (reviews ?? []).map(async (review) => {
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("username, avatar")
            .eq("username", review.username)
            .maybeSingle();

          if (userError) {
            console.error(
              `Error fetching user for userid ${review.userid}`,
              userError
            );
          }

          let avatarUrl = null;

          if (user?.avatar) {
            const { data: storageData } = supabase.storage
              .from("avatars")
              .getPublicUrl(user.avatar);

            avatarUrl = storageData?.publicUrl ?? null;
          }

          return {
            ...review,
            user: {
              username: user?.username ?? "Unknown",
              avatarUrl,
            },
          };
        })
      );

      setReviews(enrichedReviews);
      if (typeof setDisplayedReviews === "function") {
        setDisplayedReviews(enrichedReviews);
      } else {
        console.warn(
          "setDisplayedReviews is not a function",
          setDisplayedReviews
        );
      }
    };

    if (albumId) {
      getReviewsWithUserInfo();
    }
  }, [albumId]);

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <span className="no-review-text">No reviews yet</span>
      </div>
    );
  }
  console.log(reviews);

  if (!reviews) {
    return <div>loading...</div>;
  }
  return (
    <div className="reviews-background">
      {reviews.map((review, i) => (
        <div className="reviews-container" key={i}>
          <div className="indv-review-container">
            <div className="user-info">
              <div className="user-img">
                <Link to={`/${review.user.username}`}>
                  <img
                    className="user-img-in-review"
                    src={
                      review.user.avatarUrl === null
                        ? userIcon
                        : review.user.avatarUrl
                    }
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
                      Reviewed by{" "}
                      <span className="name">{review.user.username}</span>
                    </p>
                  </div>
                  <p className="date">
                    {new Date(review.date).toISOString().split("T")[0]}
                  </p>
                  <div className="stars">
                    <StaticStarRating rating={review.starrating} />
                  </div>
                </div>
              </div>
            </div>
            {review.reviewtitle && (
              <div className="title-container">
                <p className="title">{review.reviewtitle}</p>
              </div>
            )}

            {review && (
              <div className="text-Review">
                <p className="user-review">{review.reviewbody}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersReviews;
