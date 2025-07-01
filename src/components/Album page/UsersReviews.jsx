import "../../styles/Album page/UsersReviews.css";
import StaticStarRating from "../StarRating/StaticStarRating";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function UsersReviews({ limit, albumId}) {

  const { user } = useAuth0();
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const getReviews = async () => {
      const { data, error } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("albumid", albumId)
        .limit(limit)
        .order("date", { ascending: false });

      if (!error) {
        setReviews(data ?? []);
      } else {
        console.error("error fetching reviews: ", error);
      }
    };

    if (albumId) {
      getReviews();
    }
  }, [albumId]);

  // console.log(reviews);

  const [profilePic, setProfilePic] = useState(null);
  useEffect(() => {
    const getUserProfilePic = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userid", user.sub)
        .single();
      if (data) {
        const { data: image } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar);

        setProfilePic(image.publicUrl);
      }
    };
    getUserProfilePic();
  }, [albumId]);

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
                <Link to={`/${user.name}`}>
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
                      Reviewed by <span className="name">{user.name}</span>
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
