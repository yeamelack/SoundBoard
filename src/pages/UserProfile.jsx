import "../styles/UserProfile/he.css";
import Header from "../components/Header/Header.jsx";
import RecentActivity from "../components/UserProfile/RecentActivity.jsx";
import RecentActivityAlbums from "../components/UserProfile/RecentActivityAlbums.jsx";
import { Link, useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();

  return (
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
                src="https://preview.redd.it/drake-the-type-of-dumbass-to-think-corporate-forced-memes-v0-hnq1fxtyh41e1.jpg?width=176&format=pjpg&auto=webp&s=7a98915b8dc9d1b17512fb362ce262fd74106534"
                alt=""
              />
            </div>
          </div>

          <div className="user-profile-username-container">
            <span className="username">Yeamelack</span>
          </div>
        </div>
        <div className="user-profile-stats-container">
          <div className="user-stats-container">
            <div className="user-stats">
              <div className="user-stats-left-grid">
                <div className="user-rates-given">
                  <span className="user-rates-given-style">0</span>
                </div>
                <div className="rating-text-container">
                  <span className="rating-text">Rating</span>
                </div>
              </div>
              <div className="user-stats-right-grid">
                <div className="user-reviews-given">
                  <span className="user-reviews">0</span>
                </div>
                <div className="reviews-text-container">
                  <span className="reviews-text">Reviews</span>
                </div>
              </div>
            </div>
          </div>
          <Link to={`/settings`} key={userId}>
            <div className="grid-under-user-rating">
              <div className="edit-profile-button-container">
                <button className="edit-profile-button">Edit Profile</button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <div className="user-profile-nav-bar-container">
          <div className="home-button-container">
            <button className="user-profile-home-button">home</button>
          </div>
        </div>
      </div>

      <div>
        <div className="homepage-content-container">
          <div className="recent-activity-title-container">
            <span className="recent-activity-title">Recent Activity</span>
          </div>
          <div className="e">
            <div className="recent-activity-container">
              <div className="recent-activity">
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />{" "}
                <RecentActivityAlbums
                  title="pop"
                  rating="11"
                  imgLink="https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
