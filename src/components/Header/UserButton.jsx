import userIcon from "../../assets/icons/user-icon.svg";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/Header/UserButton.css";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../../misc/UserContext";

function UserButton() {
  const { isAuthenticated } = useAuth0();
  const { userInfo, refreshUserInfo } = useUser();

  console.log("userInfo")

  console.log(userInfo)

  useEffect(() => {
    if (!userInfo && isAuthenticated) {
      refreshUserInfo();
    }
  }, [userInfo, isAuthenticated, refreshUserInfo]);

  if (!isAuthenticated) return <LoginButton />;
  if (!userInfo) return null;

  return (
    <Link to={`/${userInfo.username}`} state={{ userInfo }}>
      <div className="user-button-container">
        <button className="user-button">
          <div className="user-icon-container">
            <img
              className={`user-icon-${
                userInfo?.profilePicture
                  ? "auth0-user-icon"
                  : "default-user-icon"
              }`}
              src={userInfo?.profilePicture || userIcon}
              alt="User"
            />
          </div>
        </button>
      </div>
    </Link>
  );
}

export default UserButton;
