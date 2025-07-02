import "../../styles/Album page/UsersReviews.css";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";
import { useClickContext } from "../../misc/ClickContext";

function UsersReviews({ limit, albumId, clicked }) {
  const { user, isAuthenticated } = useAuth0();
  const [reviews, setReviews] = useState([]);

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

      const enrichedReviews = await Promise.all(
        (reviews ?? []).map(async (review) => {
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("username, avatar")
            .eq("userid", review.userid)
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
    };

    if (albumId) {
      getReviewsWithUserInfo();
    }
  }, [albumId, clicked]);

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <span className="no-review-text">No reviews yet</span>
      </div>
    );
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
                    src={review.user.avatarUrl}
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
                  <p className="date"> {review.date}</p>
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
