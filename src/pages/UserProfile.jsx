import "../styles/UserProfile/UserProfile.css";
import userIcon from "../assets/icons/user-icon.svg";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../components/Header/Header.jsx";
import RecentActivity from "../components/UserProfile/RecentActivity.jsx";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useUser } from "../misc/UserContext";
import ConfirmationPopup from "../misc/ConfirmationPopup";

function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useAuth0();
  const [reviews, setReviews] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { userInfo } = useUser();

  //banner for successfully deleted albums
  useEffect(() => {
    if (location.state?.showDeleteConfirmation) {
      setShowConfirmation(true);

      const timer = setTimeout(() => {
        setShowConfirmation(false);

        //resets the state
        navigate(location.pathname, { replace: false });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.state?.showDeleteConfirmation]);

  useEffect(() => {
    const fetchAllUserReviews = async () => {
      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (userDataError) {
        console.error("Fetching user data failed", userDataError);
      }

      const { data, error } = await supabase
        .from("musicreviews")
        .select(
          `
        *,
        music (
          coverart,title,
          artists(
            artistName,
            artistid,
            profilepic
          )
        )
      `
        )
        .eq("username", userData.username)
        .order("date", { ascending: false });

      if (error) {
        console.error("Fetching user rated albums failed", error);
        return;
      }
      setReviews(data);
    };

    fetchAllUserReviews();
  }, [username]);

  useEffect(() => {
    const getProfilePicture = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("avatar")
        .eq("username", username)
        .single();

      if (error) {
        console.error("fetch error:", error);
        return;
      }

      const { data: image, error: imageError } = await supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar);

      if (imageError) {
        console.error(imageError);
      } else {
        setUserProfilePicture(image);
      }
    };

    getProfilePicture();
  }, [username]);

  const writtenReviews = reviews?.filter(
    (r) => r.reviewtitle && r.reviewtitle.trim() !== ""
  );

  const isRatingsClickable = reviews?.length > 0;
  const isReviewsClickable = writtenReviews?.length > 0;

  if (isLoading || !reviews || !writtenReviews) return <div>Loading...</div>;

  console.log(writtenReviews);
  return (
    <>
      {showConfirmation && (
        <ConfirmationPopup
          state={true}
          message={"Review deleted successfully!"}
        />
      )}

      {/* your homepage content */}
      <div className="page-grid">
        <div>
          <Header />
        </div>
        <div className="user-information-container">
          <div className="user-picture-username-container">
            <div className="user-profile-img-container">
              <div className="user-profile-flex">
                <img
                  className="user-profile-picture"
                  src={userProfilePicture.publicUrl || userIcon}
                  alt={`${username}'s Profile Picture`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = userIcon;
                  }}
                />
              </div>
            </div>

            <div className="user-profile-username-container">
              <span className="username">{username}</span>
            </div>
          </div>
          <div className="user-profile-stats-container">
            <div className="user-stats-container">
              <div className="user-stats">
                {isRatingsClickable > 0 ? (
                  <Link to={{ pathname: "rating", state: { reviews } }}>
                    <div
                      className={`user-stats-left-grid ${
                        !isRatingsClickable ? "not-clickable" : ""
                      }`}
                    >
                      <div className="user-rates-given">
                        <span className="user-rates-given-style">
                          {reviews.length}
                        </span>
                      </div>
                      <div className="rating-text-container">
                        <span className="rating-text">Ratings</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`user-stats-left-grid ${
                      !isRatingsClickable ? "not-clickable" : ""
                    }`}
                  >
                    <div className="user-rates-given">
                      <span className="user-rates-given-style">
                        {reviews?.length ?? 0}
                      </span>
                    </div>
                    <div className="rating-text-container">
                      <span className="rating-text">Ratings</span>
                    </div>
                  </div>
                )}

                {/*right reviews*/}
                {console.log("Written Reviews to pass:", writtenReviews)}
                {isReviewsClickable > 0 ? (
                  <Link
                    to={{
                      pathname: `/${username}/reviews`,
                      state: { writtenReviews },
                    }}
                  >
                    <div
                      className={`user-stats-right-grid ${
                        !isReviewsClickable ? "not-clickable" : ""
                      }`}
                    >
                      <div className="user-reviews-given">
                        <span className="user-reviews">
                          {writtenReviews.length}
                        </span>
                      </div>
                      <div className="reviews-text-container">
                        <span className="reviews-text">Reviews</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`user-stats-right-grid ${
                      !isReviewsClickable ? "not-clickable" : ""
                    }`}
                  >
                    <div className="user-reviews-given">
                      <span className="user-reviews">
                        {writtenReviews.length ?? 0}
                      </span>
                    </div>
                    <div className="reviews-text-container">
                      <span className="reviews-text">Reviews</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid-under-user-rating">
              <div className="edit-profile-button-container">
                {userInfo?.username === username && (
                  <Link to={"/settings"} key={username}>
                    <button className="edit-profile-button">
                      Edit Profile
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="user-profile-nav-bar-container">
            <div className="home-button-container">
              <button className="user-profile-home-button">Home</button>
            </div>
          </div>
        </div>

        <div>
          <div className="homepage-content-container">
            <div className="recent-activity-title-container">
              <span className="recent-activity-title">Recent Activity</span>
            </div>
            <div className="e">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
