import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "../../styles/Header/LoginAndOutButton.css";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <div className="login-logout-button-container">
      <button
        className="login-logout-button"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        <p className="login-logout-text">Log Out</p>
      </button>
    </div>
  );
};

export default LogoutButton;
