import "../styles/UserRating page/UserRating.css";
import Header from "../components/Header/Header.jsx";
import AlbumMetaInfo from "../components/Album page/AlbumMetaInfo.jsx";
import AlbumTitle from "../components/Album page/AlbumTitle.jsx";
import ArtistButton from "../components/Album page/ArtistButton.jsx";
import UsersReviews from "../components/Album page/UsersReviews";

function UserRating() {
  return (
    <div className="UserRating-page-grid">
      <div>
        <Header />
      </div>
      <div className="album-meta-data-container">
        <div className="img-container">
          <img
            className="user-rating-album-img"
            src="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
            alt=""
          />
        </div>
        <div className="user-rating-album-meta-data">
          <div className="user-rating-album-title-container">
            <AlbumTitle title="DeBÍ TiRAR MáS FOToS" />
          </div>
          <AlbumMetaInfo type="album" year="2025" trackCount="10" />
          <div className="artist-button-in-user-rating">
            <ArtistButton artistName="drake" />
          </div>
        </div>
      </div>

      <div className="album-rating-user-review-container">
        <div className="user-rating-review">
          <UsersReviews
            username=" Yeamelack"
            date="1/1/2021"
            rating="4.5"
            review="personally i think so. admittedly i've never been big bladee fan and have only listened to probably a quarter of his discography so take this with a grain of salt. this project is in my opinion his most intriguing, memorable, and entertaining listen. the production on this thing is off the damn walls and all the features (my favorite being black kray) absolutely deliver. despite its 30 track run time, it surprisingly never feels dull or drug out and holds my attention WAY more than his other projects have for me. i'm a much bigger fan of bladee when he doesn't have the super atmospheric and crazy auto tuned vocals which i've been accustomed to with all of the previous projects i've heard from him. i've gotta admit with this album and his collaboration tape with yung lean from just a few weeks ago, bladee is definitely starting to grow on me and make me tilt my opinion on him.

add
"
            profilePic=""
          />
        </div>
        <div className="user-rating-bottom-right">
          <div className="delete-review-button">
            <span>Delete review</span>
          </div>
          <div className="edit-review-button">
            <span>Edit review</span>
          </div>
          <div className="rate-this-album-button">
            <span>Rate this album</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRating;
