import "../styles/UserRating/UserRating.css";
import Header from "../components/Header/Header.jsx";
import AlbumMetaInfo from "../components/Album page/AlbumMetaInfo.jsx";
import ArtistButton from "../components/Album page/ArtistButton.jsx";
import IndividualReview from "../components/UserRating page/IndividualReview";
import DeleteMenu from "../components/UserRating page/DeleteMenu";
import supabase from "../supabase/supabaseClient";
import ReviewBox from "../components/Homepage/ReviewBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClickContext } from "../misc/ClickContext";

function UserRating() {
  const location = useLocation();
  const userAndAlbumInfo = location.state?.album; // review + user + album associated with review


  const { user, isAuthenticated } = useAuth0();
  const [artistInfo, setArtistInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [reviewInfo, setReviewInfo] = useState(userAndAlbumInfo || null);
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [editedStars, setEditedStars] = useState(reviewInfo?.starrating || 0);
  const { clicked } = useClickContext();
  const { username, reviewId } = useParams();
  const [boxMode, setBoxMode] = useState(null); // 'edit' or 'rate'

  const [deleteOverlay, setDeleteOverlay] = useState(false);

  useEffect(() => {
    const fetchUserAndAlbumInfo = async () => {
      if (reviewInfo !== null || !reviewId) return;

      const { data: reviewData, error: reviewError } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("albumreviewid", reviewId)
        .single();

      const { data: albumData, error: albumError } = await supabase
        .from("music")
        .select("*")
        .eq("albumid", reviewData.albumid)
        .single();

      if (albumError || reviewError) {
        console.error("Error loading data:", albumError || reviewError);
        return;
      }

      const combinedData = {
        ...albumData,
        date: reviewData.date,
        starrating: reviewData.starrating,
        reviewtitle: reviewData.reviewtitle,
        reviewbody: reviewData.reviewbody,
        username: reviewData.username,
        albumreviewid: reviewData.albumreviewid,
      };

      setReviewInfo(combinedData);
      setEditedStars(combinedData.starrating);

      console.log("combined data");
      console.log(combinedData);
    };

    fetchUserAndAlbumInfo();
  }, [userAndAlbumInfo, user, reviewId]);

  const handleClick = (mode) => {
    if (isAuthenticated) {
      setBoxMode(mode);
      setOverlayVisiablity(true);
    }
  };

  useEffect(() => {
    const getArtistInfo = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artistid", reviewInfo.artistid)
        .single();
      if (error) {
        console.error("artist fetch error", error);
      } else {
        setArtistInfo(data);
        console.log("data");
        console.log(data);
      }
    };

    const getUserInfo = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", reviewInfo.username)
        .single();

      if (error) {
        console.error("user fetch error", error);
        return;
      }

      setUserInfo(data);

      const { data: image, error: imageError } = await supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar);

      if (imageError) {
        console.error("image fetch error", imageError);
      } else {
        setUserProfilePicture(image);
      }
    };

    //runs the querying information after review information is given
    if (reviewInfo?.artistid && reviewInfo?.username) {
      getArtistInfo();
      getUserInfo();
    }
  }, [reviewInfo]);

  useEffect(() => {
    const getUpdatedReview = async () => {
      const { data, error } = await supabase
        .from("musicreviews")
        .select("reviewbody, reviewtitle")
        .eq("albumreviewid", userAndAlbumInfo.albumreviewid)
        .single();

      if (data) {
        setReviewInfo((prev) => ({
          ...prev,
          reviewbody: data.reviewbody,
          reviewtitle: data.reviewtitle,
        }));
      } else {
        console.log("error while updating review:", error);
      }
    };

    if (clicked) {
      getUpdatedReview();
    }
  }, [clicked]);

  const handleDeleteOverlay = () => {
    if (isAuthenticated) {
      setDeleteOverlay(!deleteOverlay);
    }
  };

  console.log("artistInfo");
  console.log(artistInfo);

  console.log("userInfo");
  console.log(userInfo);

  console.log("userProfilePicture");
  console.log(userProfilePicture);

  if (!artistInfo || !userInfo || !userProfilePicture) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="UserRating-page-grid">
      <div>
        <Header />
      </div>
      <div className="rating-page-banner">
        <div className="rating-page-album-art-container">
          <Link to={`/${reviewInfo.artistid}/album/${reviewInfo.albumid}`}>
            <img
              className="rating-page-album-art"
              src={reviewInfo.coverart}
              alt={`${reviewInfo.title} album cover`}
            />
          </Link>
        </div>

        <div className="album-meta-data-section">
          <div>
            <span className="rated-album-title">{reviewInfo.title}</span>
          </div>
          <div className="album-meta-data">
            <AlbumMetaInfo
              type={
                reviewInfo.type.charAt(0).toUpperCase() +
                String(reviewInfo.type).slice(1)
              }
              year={new Intl.DateTimeFormat("en-US").format(
                new Date(reviewInfo.releasedate)
              )}
              trackCount={reviewInfo.tracks.total}
            />
          </div>
          <div className="artist-page-button">
            <ArtistButton
              artistPicture={artistInfo.profilepic}
              artistName={artistInfo.artistName}
            />
          </div>
        </div>
      </div>

      <div className="album-rating-user-review-container">
        <div className="user-rating-review">
          <IndividualReview
            username={userInfo.username}
            date={new Date(reviewInfo.date).toISOString().split("T")[0]}
            rating={editedStars}
            title={reviewInfo.reviewtitle}
            review={reviewInfo.reviewbody}
            profilePic={userProfilePicture.publicUrl}
          />
        </div>
        <div className="user-rating-bottom-right">
          <button
            onClick={() => handleClick("edit")}
            className="edit-review-button"
          >
            Edit review
          </button>

          <button
            onClick={() => handleClick("rate")}
            className="rate-this-album-button"
          >
            Rate this album again
          </button>

          {overlayVisiablity && (
            <ReviewBox
              result={reviewInfo}
              currentTitle={
                boxMode === "edit" ? reviewInfo.reviewtitle : undefined
              }
              reviewbody={
                boxMode === "edit" ? reviewInfo.reviewbody : undefined
              }
              starrating={boxMode === "edit" ? editedStars : undefined}
              toggleVisiablity={setOverlayVisiablity}
              reviewId={
                boxMode === "edit" ? reviewInfo.albumreviewid : undefined
              }
              setEditedStars={boxMode === "edit" ? setEditedStars : undefined}
            />
          )}

          <button
            onClick={handleDeleteOverlay}
            className="delete-review-button"
          >
            Delete review
          </button>

          {deleteOverlay && (
            <DeleteMenu
              reviewId={reviewInfo.albumreviewid}
              handleDeleteOverlay={handleDeleteOverlay}
              username={username}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRating;
