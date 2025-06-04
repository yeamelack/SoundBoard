import "../styles/UserProfile/UserProfile.css";
import Header from "../components/Header/Header.jsx";
import RecentActivity from "../components/UserProfile/RecentActivity.jsx";
import ReviewButton from "../components/Header/ReviewButton";

function UserProfile() {
  return (
    <div className="user-profile-container">
      <Header />
      <div className="user-profile-base-grid">
        <div className="user-information-container">
          <div className="user-picture-username-container">
            <div className="user-profile-img-container">
              <img className="user-profile-picture" src="" alt="" />
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
                    <span>0</span>
                  </div>
                  <div className="rating-text-container">
                    <span>rating</span>
                  </div>
                </div>
                <div className="user-stats-right-grid">
                  <div className="user-reviews-given">
                    <span>0</span>
                  </div>
                  <div className="reviews-text-container">
                    <span>reviews</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-under-user-rating">
              <div className="edit-profile-button-container">
                <button className="edit-profile-button">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
