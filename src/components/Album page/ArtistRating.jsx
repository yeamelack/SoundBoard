import "../../styles/Album page/ArtistRatings.css";
import ReviewBox from "../Homepage/ReviewBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";

function ArtistRatings({ userRating, albumInfo }) {
  const { user } = useAuth0();
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [reviewJson, setReviewJson] = useState(null);
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const { artistId, albumId } = useParams();

  

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

  useEffect(() => {
    const fetchEverything = async () => {
      const albumid = albumInfo?.albumid;
      if (!albumid) return;

      // Fetch average rating
      const { data: avg, error: avgError } = await supabase.rpc(
        "get_album_average_rating",
        { album_id_input: albumid }
      );

      if (avgError) console.error(avgError);
      setAverageRating(avg ?? 0); // fallback to 0

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
        setReviewJson(userReview); // may be null, that's fine
      }

      setIsLoading(false); // All fetches done
    };

    fetchEverything();
  }, [albumInfo, user]);

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
            className="review-button-artist"
            onClick={handleClick}
            style={{
              cursor: "pointer",
              opacity: isAuthenticated ? 1 : 0.8,
            }}
          >
            <span className="artist-rating-review-text">
              {isAuthenticated ? "Review" : "Login to write a review"}{" "}
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
