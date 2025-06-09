import "../styles/Edit profile/EditProfile.css";
import Header from "../components/Header/Header.jsx";


function EditProfile({ username }) {
  return (
    <div className="edit-profile-grid">
      <div>
        <Header />
      </div>

      <div className="change-user-name-input">
        <span className="setting-header">Change Username</span>
        <input
          className="change-username-input-box"
          type="text"
          placeholder={username}
        />

        <button className="save-button">Save</button>
      </div>

      <div className="change-password-box">
        <span className="setting-header">Change password</span>
        <input
          placeholder="Current password"
          className="old-password-input-box"
          type="text"
        />
        <input
          placeholder="New password"
          className="new-password-input-box"
          type="text"
        />

        <button className="save-button">Save</button>
      </div>

      <div className="profile-picture-section">
        <span className="setting-header">Profile Picture</span>
        <input
          type="file"
          accept="image/*"
          className="change-profile-pic-input"
        />
        <button className="save-button">Save</button>
      </div>
    </div>
  );
}

export default EditProfile;
