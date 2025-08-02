import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "../../styles/Header/LoginAndOutButton.css";

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();

  return (
    <div className="login-logoutbutton-container">
      <button className="login-logout-button" onClick={() => loginWithPopup()}>
        <p className="login-logout-text">Login</p>
      </button>
    </div>
  );
};

export default LoginButton;
