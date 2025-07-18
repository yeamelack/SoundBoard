import EditProfileStyle from "../styles/Edit profile/EditProfile.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../misc/UserContext";
import { useEffect, useState } from "react";
import Header from "../components/Header/Header.jsx";
import ConfirmationPopup from "../misc/ConfirmationPopup";
import supabase from "../supabase/supabaseClient";
import ProfileImageUploader from "../misc/ProfileImageUploader";

function EditProfile() {
  const { user } = useAuth0();
  const { userInfo, refreshUserInfo } = useUser();
  console.log("userInfo");

  const isSocialLogin = user?.sub?.startsWith("google-oauth2");

  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameUpdatedSuccessfully, setUsernameUpdatedSuccessfully] =
    useState(false);

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [profileImageUploaded, setProfileImageUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getUsername = (event) => {
    setNewUsername(event.target.value);
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  const updateProfilePicture = async () => {
    setUploading(true);
    if (newProfilePicture) {
      //upload picture to storage
      const profilePictureExt = newProfilePicture.name.split(".").pop();
      const profilePicturePath = `avatars/${
        userInfo?.username
      }-${Date.now()}.${profilePictureExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(profilePicturePath, newProfilePicture);

      if (uploadError) {
        setError("Image failed to upload. Please try again later.");
        return;
      }

      //remove users previous profile picture from storage
      if (userInfo.profilePicturePath) {
        const filePath = userInfo.profilePicturePath.replace("avatars/", "");

        const { data, error } = await supabase.storage
          .from("avatars")
          .remove([`avatars/${filePath}`]); // prepend again, relative to bucket

        if (error) {
          console.error("Delete failed:", error);
          setError("Image failed to delete. Please try again later.");
          return;
        }
      }

      //updates the path to new profile picture in user
      const { error } = await supabase.from("users").upsert([
        {
          userid: userInfo.auth0id,
          username: userInfo.username,
          avatar: profilePicturePath,
        },
      ]);

      if (error) {
        setError("Image failed to upload. Please try again later.");
        return;
      }

      //reload users information with new data
      refreshUserInfo();
      setUploading(false);
      setProfileImageUploaded(true);
    }
  };

  const submitNewUsername = async () => {
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError("Usernames can only contain letters, numbers, and underscores.");
      return;
    }

    const normalizedUsername = newUsername.toLowerCase().trim();

    if (userInfo?.username === newUsername) {
      setError(`${newUsername} is already your username`);
      return;
    }

    const { data: existing } = await supabase
      .from("users")
      .select("userid")
      .eq("username", normalizedUsername)
      .single();

    if (existing) {
      setError("Username already taken");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ username: normalizedUsername })
      .eq("userid", userInfo.auth0id);

    if (error) {
      setError("Failed to change username. Please try again later.");
      return;
    }
    refreshUserInfo();
    setProfileImageUploaded(true);
  };

  return (
    <>
      {usernameUpdatedSuccessfully && (
        <ConfirmationPopup message={"Username successfully changed!"} />
      )}

      {useEffect(() => {
        if (usernameUpdatedSuccessfully) {
          refreshUserInfo();
          const timer = setTimeout(() => {
            setUsernameUpdatedSuccessfully(false);
          }, 1800);

          return () => clearTimeout(timer);
        }
      }, [usernameUpdatedSuccessfully])}

      <div className={EditProfileStyle["edit-profile-grid"]}>
        <div>
          <Header />
        </div>

        <div
          className={
            error
              ? EditProfileStyle["change-user-name-input-error"]
              : EditProfileStyle["change-user-name-input-no-error"]
          }
        >
          <span className={EditProfileStyle["setting-header"]}>
            Change Username
          </span>
          {error ? (
            <div>
              <span
                className={EditProfileStyle["error-text"]}
              >{`* ${error}`}</span>
            </div>
          ) : null}
          <input
            onChange={getUsername}
            className={EditProfileStyle["change-username-input-box"]}
            type="text"
            placeholder={userInfo?.username}
          />
          <button
            onClick={submitNewUsername}
            className={EditProfileStyle["save-button"]}
          >
            Save
          </button>
        </div>

        <div className={EditProfileStyle["change-password-box"]}>
          <span className={EditProfileStyle["setting-header"]}>
            Change Password
          </span>

          {isSocialLogin ? (
            <div className={EditProfileStyle["password-disabled-message"]}>
              <p>
                Password changes are managed by Google.
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={EditProfileStyle["google-account-link"]}
                >
                  Manage your Google account
                </a>
              </p>
            </div>
          ) : (
            <>
              <input
                placeholder="Current password"
                className={EditProfileStyle["old-password-input-box"]}
                type="password"
              />
              <input
                placeholder="New password"
                className={EditProfileStyle["new-password-input-box"]}
                type="password"
              />
              <button className={EditProfileStyle["save-button"]}>Save</button>
            </>
          )}
        </div>

        <div className={EditProfileStyle["profile-picture-section"]}>
          <span className={EditProfileStyle["setting-header"]}>
            Profile Picture
          </span>
          <div className={EditProfileStyle["image-upload-container"]}>
            <ProfileImageUploader
              onFileSelect={(selectedFile) => {
                setNewProfilePicture(selectedFile);
                setImagePreview(URL.createObjectURL(selectedFile));
              }}
              previewImage={imagePreview}
            />
          </div>
          <button
            onClick={updateProfilePicture}
            disabled={!newProfilePicture}
            className={EditProfileStyle["save-button"]}
          >
            {uploading
              ? "Saving...."
              : profileImageUploaded
              ? "Saved!"
              : "Save"}
          </button>

          {profileImageUploaded && (
            <ConfirmationPopup
              message={"New profile picture was sucessfully uploaded."}
              state={profileImageUploaded}
            />
          )}

          {useEffect(() => {
            if (profileImageUploaded) {
              refreshUserInfo();
              const timer = setTimeout(() => {
                setProfileImageUploaded(false);
              }, 1900);

              return () => clearTimeout(timer);
            }
          }, [profileImageUploaded])}
        </div>
      </div>
    </>
  );
}

export default EditProfile;
