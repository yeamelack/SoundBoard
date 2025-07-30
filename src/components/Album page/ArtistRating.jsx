import "../../styles/Album page/ArtistRatings.css";
import ReviewBox from "../Homepage/ReviewBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useClickContext } from "../../misc/ClickContext";
import StarRating from "../StarRating/StarRating";
import { useUser } from "../../misc/UserContext";
import useUpdateReview from "../../hooks/useUpdateReviews";

function ArtistRatings({
  userRating,
  albumInfo,
  displayedReview,
  setUpdatedReview,
}) {
  const { user } = useAuth0();
  const { userInfo } = useUser();
  const updateReview = useUpdateReview();
  const { clickInfo, setClickInfo } = useClickContext();
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [reviewJson, setReviewJson] = useState(null);
  const [editedStarReview, setUpdatedStarReview] = useState(0);
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const handleStarRatingClick = (newRating) => {
    setUpdatedStarReview(newRating);

    const displayed = displayedReview.find(
      (review) => review.albumreviewid === reviewJson.albumreviewid
    );

    if (displayed) {
      setClickInfo({ clicked: false });

      setTimeout(() => {
        setClickInfo({
          clicked: true,
          source: "StarRatingUpdate",
        });
      }, 0);

      setUpdatedReview({
        ...displayed,
        starrating: newRating,
      });
    }
  };

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

  const fetchEverything = async () => {
    const albumid = albumInfo?.albumid;
    console.log("albumid", albumid);
    if (!albumid) return;

    // Fetch average ratings
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getMusicReview/${albumid}`
      );
      const json = await res.json();
      console.log("JSON000", json);

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch music reviews");
      }

      const reviews = json.reviews || [];
      const count = json.count ?? 0;

      // Calculate average rating from reviews
      const totalRating = reviews.reduce(
        (sum, review) => sum + (review.starrating || 0),
        0
      );
      const avg = count > 0 ? totalRating / count : 0;
      const avgRounded = Math.round(avg * 10) / 10;

      setAverageRating(avgRounded);
      setTotalRatings(count);

      console.log("avgRounded", avgRounded);
    } catch (error) {
      console.error("Error fetching review data:", error.message);
      setAverageRating(0);
      setTotalRatings(0);
    }

    if (user) {
      const { data: userReview, error: userError } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("username", userInfo.username)
        .eq("albumid", albumid)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("userReview 10000", userReview);
      if (userError) console.error(userError);
      setReviewJson(userReview);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (userInfo || albumInfo) {
      fetchEverything();
    }
  }, [albumInfo, userInfo]);

  useEffect(() => {
    if (!clickInfo.clicked) return;

    if (clickInfo.source === "ReviewBox-Submit") {
      //timeout allows enough time for average to be recalculated
      setTimeout(fetchEverything, 50);
    }
  }, [clickInfo]);

  useEffect(() => {
    const updateUserReview = async () => {
      if (!reviewJson?.albumreviewid) return;

      try {
        await updateReview(reviewJson.albumreviewid, {
          starrating: editedStarReview,
          date: new Date().toISOString(),
        });
        fetchEverything();
      } catch (error) {
        console.error("Error updating edited review:", error.message);
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
                  onRatingChange={handleStarRatingClick}
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
