import userIcon from "../../assets/icons/user-icon.svg";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/Header/UserButton.css";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";

function UserButton() {
  const { user, isAuthenticated } = useAuth0();
  const [userProfilePicture, setUserProfilePicture] = useState("");

  useEffect(() => {
    const getProfilePicture = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("avatar")
        .eq("userid", user.sub)
        .single();

      if (error) {
        console.error("fetch error:", error);
        return;
      }

      const { data: image, error: imageError } = await supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar);

      if (imageError) {
        console.error(imageError);
      } else {
        setUserProfilePicture(image);
      }
    };

    getProfilePicture();
  }, [user.sub]);

  return isAuthenticated ? (
    <Link to={`/${user.name}`}>
      <div className="user-button-container">
        <button className="user-button">
          <div className="user-icon-container">
            <img
              className={`user-icon-${
                user.picture ? "auth0-user-icon" : "default-user-icon"
              }`}
              src={userProfilePicture.publicUrl || user.picture || userIcon}
              alt="User"
            />
          </div>
        </button>
      </div>
    </Link>
  ) : (
    <LoginButton />
  );
}

export default UserButton;
