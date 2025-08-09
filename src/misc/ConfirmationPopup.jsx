import ConfirmationPopupStyle from "../styles/misc/ConfirmationPopup.module.css";

function ConfirmationPopup({ message, state }) {
  const popupClass = state
    ? ConfirmationPopupStyle["confirmation-popup-success"]
    : ConfirmationPopupStyle["confirmation-popup-failed"];

  return <div className={popupClass}>{message}</div>;
}

export default ConfirmationPopup;
