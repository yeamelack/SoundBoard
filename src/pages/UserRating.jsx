import "../styles/UserRating page/UserRating.css";
import Header from "../components/Header/Header.jsx";
import AlbumMetaInfo from "../components/Album page/AlbumMetaInfo.jsx";
import ArtistButton from "../components/Album page/ArtistButton.jsx";
import UsersReviews from "../components/Album page/UsersReviews";
import supabase from "../supabase/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";
import { data, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function UserRating() {
  const location = useLocation();
  const album = location.state?.album;
  const { user } = useAuth0();
  const [artistInfo, setArtistInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  useEffect(() => {
    const getArtistInfo = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artistid", album.artistid)
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
        .eq("userid", album.userid)
        .single();

      if (error) {
        console.error("user fetch error", error);
        return;
      }

      setUserInfo(data);

      // Now fetch the profile picture using data.avatar
      const { data: image, error: imageError } = await supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar);

      if (imageError) {
        console.error("image fetch error", imageError);
      } else {
        setUserProfilePicture(image);
      }
    };

    if (album?.artistid && album?.userid) {
      getArtistInfo();
      getUserInfo();
    }
  }, [album]);

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
          <Link to={`/${album.artistid}/album/${album.albumid}`}>
            <img
              className="rating-page-album-art"
              src={album.coverart}
              alt={`${album.title} album cover`}
            />
          </Link>
        </div>

        <div className="album-meta-data-section">
          <div>
            <span className="rated-album-title">{album.title}</span>
          </div>
          <div className="album-meta-data">
            <AlbumMetaInfo
              type={
                album.type.charAt(0).toUpperCase() + String(album.type).slice(1)
              }
              year={new Intl.DateTimeFormat("en-US").format(
                new Date(album.releasedate)
              )}
              trackCount={album.tracks.total}
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
          <UsersReviews
            username={userInfo.username}
            date="1/1/2021"
            rating={album.starrating}
            title={album.reviewtitle}
            review={album.reviewbody}
            profilePic={userProfilePicture.publicUrl}
          />
        </div>
        <div className="user-rating-bottom-right">
          <div className="edit-review-button">
            <span>Edit review</span>
          </div>
          <div className="rate-this-album-button">
            <span>Rate this album again</span>
          </div>
          <div className="delete-review-button">
            <span>Delete review</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRating;
