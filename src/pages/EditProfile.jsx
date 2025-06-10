import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Edit profile/EditProfile.css";
import Header from "../components/Header/Header.jsx";

function EditProfile() {
  const { user } = useAuth0();
  const isSocialLogin = user?.sub?.startsWith("google-oauth2");

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
          placeholder={user?.name}
        />
        <button className="save-button">Save</button>
      </div>

      <div className="change-password-box">
        <span className="setting-header">Change Password</span>

        {isSocialLogin ? (
          <div className="password-disabled-message">
            <p>Password changes are managed by Google. 
              <a 
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="google-account-link"
              >
                Manage your Google account
              </a>
            </p>
          </div>
        ) : (
          <>
            <input
              placeholder="Current password"
              className="old-password-input-box"
              type="password"
            />
            <input
              placeholder="New password"
              className="new-password-input-box"
              type="password"
            />
            <button className="save-button">Save</button>
          </>
        )}
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
