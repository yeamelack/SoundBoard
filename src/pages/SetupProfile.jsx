import SetupPageStyle from "../styles/SetupProfile/SetupProfile.module.css";
import ProfileImageUploader from "../misc/ProfileImageUploader";
import supabase from "../supabase/supabaseClient";
import { useState, useEffect, setError } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useClickContext } from "../misc/ClickContext";

function SetupProfile() {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState();
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth0();
  const { handleClick } = useClickContext();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async () => {
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Usernames can only contain letters, numbers, and underscores.");
      return;
    }

    const normalizedUsername = username.toLowerCase().trim();

    const { data: existing } = await supabase
      .from("users")
      .select("userid")
      .eq("username", normalizedUsername)
      .single();

    if (existing) {
      setError("Username already taken");
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        userid: user.sub,
        username: normalizedUsername,
        numberofrating: 0,
        numberofreviews: 0,
      },
    ]);

    if (insertError) {
      console.error("Insert failed", insertError);
      return;
    }

    if (file) {
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${normalizedUsername}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Image upload failed:", uploadError.message);
      } else {
        const { error: updateError } = await supabase
          .from("users")
          .update({ avatar: filePath })
          .eq("userid", user.sub);

        if (updateError) {
          console.error("Failed to update avatar path:", updateError.message);
        } else {
          console.log("Avatar uploaded and user updated.");
        }
      }
    }

    navigate("/");
  };

  return (
    <div className={SetupPageStyle["setup-container"]}>
      <div className={SetupPageStyle["setup-menu-container"]}>
        <div className={SetupPageStyle["welcome-text-container"]}>
          <span className={SetupPageStyle["welcome-text"]}>
            Welcome to SoundBoard!
          </span>
        </div>
        <div className={SetupPageStyle["image-uploader-container"]}>
          <div>
            <ProfileImageUploader
              onFileSelect={(selectedFile) => {
                setFile(selectedFile);
                setPreviewImage(URL.createObjectURL(selectedFile));
              }}
              previewImage={previewImage}
            />
          </div>
        </div>

        <div className={SetupPageStyle["username-input-container"]}>
          {error && (
            <div className={SetupPageStyle["error-message-container"]}>
              <span className={SetupPageStyle["error-text"]}>{error}</span>
            </div>
          )}
          <div className={SetupPageStyle["input-container"]}>
            <input
              className={SetupPageStyle["username-input"]}
              type="text"
              placeholder="Set Username"
              onChange={handleUsername}
            />
          </div>
        </div>
        <div className={SetupPageStyle["submit-button-container"]}>
          <button
            onClick={handleSubmit}
            className={SetupPageStyle["submit-button"]}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupProfile;
