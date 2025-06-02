import userIcon from "../../assets/icons/user-icon.svg";
import "../../styles/Header/UserButton.css";

function UserButton() {
  return (
    <div className="user-button-container">
      <button className="user-button">
        <div className="user-icon-container">
          <img className="user-icon" src={userIcon} alt="User" />
        </div>
      </button>
    </div>
  );
}

export default UserButton;
