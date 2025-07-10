import userIcon from "../../assets/icons/user-icon.svg";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/Header/UserButton.css";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { useUser } from "../../misc/UserContext";

function UserButton() {
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState("");
  const userLoginedInfo = useUser();

  useEffect(() => {
    const getUserInformation = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
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
      }

      setUserInfo({
        ...data,
        avatarUrl: image?.publicUrl || null,
      });
    };

    getUserInformation();
  }, [user.sub]);

  return isAuthenticated ? (
    <Link to={`/${userInfo.username}`} state={{ userInfo }}>
      <div className="user-button-container">
        <button className="user-button">
          <div className="user-icon-container">
            <img
              className={`user-icon-${
                userLoginedInfo.profilePicture
                  ? "auth0-user-icon"
                  : "default-user-icon"
              }`}
              src={userLoginedInfo.profilePicture || userIcon}
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
