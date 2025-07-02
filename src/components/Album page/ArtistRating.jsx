import "../../styles/Album page/ArtistRatings.css";
import ReviewBox from "../Homepage/ReviewBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useClickContext } from "../../misc/ClickContext";
import StarRating from "../StarRating/StarRating";

function ArtistRatings({ userRating, albumInfo }) {
  const { user } = useAuth0();
  const { clicked } = useClickContext();

  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [reviewJson, setReviewJson] = useState(null);
  const [editedStarReview, setUpdatedStarReview] = useState(0);
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isAuthenticated) {
      setOverlayVisiablity(!overlayVisiablity);
    } else {
      loginWithPopup();
    }
  };

  if (!userRating) {
    userRating = 0;
  }

  const [isLoading, setIsLoading] = useState(true);

  const fetchEverything = async () => {
    const albumid = albumInfo?.albumid;
    if (!albumid) return;

    // Fetch average rating
    const { data: avg, error: avgError } = await supabase.rpc(
      "get_album_average_rating",
      { album_id_input: albumid }
    );

    if (avgError) console.error(avgError);
    setAverageRating(avg ?? 0);

    // Fetch total ratings
    const { count, error: countError } = await supabase
      .from("musicreviews")
      .select("*", { count: "exact", head: true })
      .eq("albumid", albumid);

    if (countError) console.error(countError);
    setTotalRatings(count ?? 0);

    // Fetch user review
    if (user?.sub) {
      const { data: userReview, error: userError } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("userid", user.sub)
        .eq("albumid", albumid)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (userError) console.error(userError);
      setReviewJson(userReview);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchEverything();
  }, [albumInfo, clicked, editedStarReview, user]);

  useEffect(() => {
    const updateUserReview = async () => {
      const { data, error } = await supabase
        .from("musicreviews")
        .update({ starrating: editedStarReview })
        .eq("albumreviewid", reviewJson?.albumreviewid);
      if (error) {
        console.error("error updating edited review", error);
      } else {
        fetchEverything();
      }
    };
    updateUserReview();
  }, [editedStarReview]);

  if (isLoading) {
    return <div>loading</div>;
  }

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
              <div className="total-rating">
                <span className="slash5">{averageRating} / 5</span>
              </div>
              <div className="average-rating">Average rating</div>
            </div>
          </div>

          <div className="total-rating-container">
            <div className="center-ratings">
              <div className="total-rating">
                <span className="slash5">
                  {reviewJson?.starrating ?? 0} / 5
                </span>
              </div>
              <div className="average-rating">Your rating</div>
            </div>
          </div>
        </div>

        <div className="review-button-container">
          <button
            className={`review-button-artist ${
              isHovered && reviewJson && isAuthenticated
                ? "reviewed-hover"
                : reviewJson && isAuthenticated
                ? "has-reviewed"
                : "hasnt-reviewed"
            }`}
            onClick={handleClick}
            style={{
              cursor: "pointer",
              opacity: isAuthenticated ? 1 : 0.8,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span
              className={`artist-rating-review-text ${
                reviewJson && isAuthenticated && isHovered
                  ? "stars-centered-hovered"
                  : isAuthenticated &&
                    reviewJson &&
                    "authenicated-and-reviewed-text-color"
              }`}
            >
              {reviewJson && isAuthenticated && isHovered ? (
                <StarRating
                  currentRating={reviewJson?.starrating}
                  onRatingChange={setUpdatedStarReview}
                />
              ) : reviewJson && isAuthenticated ? (
                "Edit Review"
              ) : isAuthenticated ? (
                "Review"
              ) : (
                "Login to write a review"
              )}
            </span>
          </button>
          {overlayVisiablity && (
            <div className="overlay">
              <ReviewBox result={albumInfo} toggleVisiablity={handleClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistRatings;
