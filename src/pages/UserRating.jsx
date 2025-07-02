import "../styles/UserRating/UserRating.css";
import Header from "../components/Header/Header.jsx";
import AlbumMetaInfo from "../components/Album page/AlbumMetaInfo.jsx";
import ArtistButton from "../components/Album page/ArtistButton.jsx";
import IndividualReview from "../components/UserRating page/IndividualReview";
import supabase from "../supabase/supabaseClient";
import ReviewBox from "../components/Homepage/ReviewBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClickContext } from "../misc/ClickContext";
import { click } from "@testing-library/user-event/dist/click";

function UserRating() {
  const location = useLocation();
  const userAndAlbumInfo = location.state?.album; // review + user album associated with review
  const { isAuthenticated } = useAuth0();
  const [artistInfo, setArtistInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [reviewInfo, setReviewInfo] = useState(userAndAlbumInfo);
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [editedStars, setEditedStars] = useState(reviewInfo.starrating);
  const { clicked } = useClickContext();

  const handleClick = () => {
    if (isAuthenticated) {
      setOverlayVisiablity(!overlayVisiablity);
    }
  };

  useEffect(() => {
    const getArtistInfo = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artistid", userAndAlbumInfo.artistid)
        .single();
      if (error) {
        console.error("artist fetch error", error);
      } else {
        setArtistInfo(data);
      }
    };

    const getUserInfo = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userid", userAndAlbumInfo.userid)
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

    if (userAndAlbumInfo?.artistid && userAndAlbumInfo?.userid) {
      getArtistInfo();
      getUserInfo();
    }
  }, [userAndAlbumInfo]);

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
      }
    };

    if (clicked) {
      getUpdatedReview();
    }
  }, [clicked]);

  useEffect(() => {
    console.log("clicked");
  }, [clicked]);

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
          <Link
            to={`/${userAndAlbumInfo.artistid}/album/${userAndAlbumInfo.albumid}`}
          >
            <img
              className="rating-page-album-art"
              src={userAndAlbumInfo.coverart}
              alt={`${userAndAlbumInfo.title} album cover`}
            />
          </Link>
        </div>

        <div className="album-meta-data-section">
          <div>
            <span className="rated-album-title">{userAndAlbumInfo.title}</span>
          </div>
          <div className="album-meta-data">
            <AlbumMetaInfo
              type={
                userAndAlbumInfo.type.charAt(0).toUpperCase() +
                String(userAndAlbumInfo.type).slice(1)
              }
              year={new Intl.DateTimeFormat("en-US").format(
                new Date(userAndAlbumInfo.releasedate)
              )}
              trackCount={userAndAlbumInfo.tracks.total}
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
          <>
            <button onClick={handleClick} className="edit-review-button">
              Edit review
            </button>

            {overlayVisiablity && (
              <ReviewBox
                result={userAndAlbumInfo}
                currentTitle={userAndAlbumInfo.reviewtitle}
                reviewbody={userAndAlbumInfo.reviewbody}
                starrating={editedStars}
                toggleVisiablity={setOverlayVisiablity}
                reviewId={userAndAlbumInfo.albumreviewid}
                setEditedStars={setEditedStars}
              />
            )}
          </>

          <button className="rate-this-album-button">
            Rate this album again
          </button>
          <button className="delete-review-button">Delete review</button>
        </div>
      </div>
    </div>
  );
}

export default UserRating;
