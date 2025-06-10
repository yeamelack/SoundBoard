import userIcon from "../../assets/icons/user-icon.svg";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/Header/UserButton.css";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";

function UserButton() {
  const { user, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Link to={`/${user.name}`}>
      <div className="user-button-container">
        <button className="user-button">
          <div className="user-icon-container">
            <img
              className={`user-icon-${
                user.picture ? "auth0-user-icon" : "default-user-icon"
              }`}
              src={user.picture || userIcon}
              alt="User"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userIcon;
              }}
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
