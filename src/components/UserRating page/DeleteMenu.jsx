import { useState } from "react"; // <-- this was missing
import { useNavigate } from "react-router-dom";
import DeleteMenuStyle from "../../styles/UserRating/DeleteMenu.module.css";
import supabase from "../../supabase/supabaseClient";
import useDeleteReviews from "../../hooks/useDeleteReviews";
import ConfirmationPopup from "../../misc/ConfirmationPopup";

function DeleteMenu({ username, handleDeleteOverlay, reviewId }) {
  const navigate = useNavigate();
  const deleteReview = useDeleteReviews();
  const [showError, setShowError] = useState(false);

  const handleDeleteClick = async () => {
    try {
      await deleteReview(reviewId);
      navigate(`/${username}`, {
        state: { showDeleteConfirmation: true },
      });
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <>
      {showError && (
        <ConfirmationPopup
          message={"Failed to delete"}
          state={false}
          onClose={() => setShowError(false)}
        />
      )}

      <div className="overlay">
        <div className={DeleteMenuStyle["delete-menu-container"]}>
          <div className={DeleteMenuStyle["menu-container"]}>
            <div className={DeleteMenuStyle["are-you-sure-container"]}>
              <div className={DeleteMenuStyle["confirm-delete-text-container"]}>
                <span className={DeleteMenuStyle["confirm-delete-text"]}>
                  Confirm to delete the album
                </span>
              </div>
              <div className={DeleteMenuStyle["are-you-sure-text-container"]}>
                <span className={DeleteMenuStyle["are-you-sure-text"]}>
                  Are you sure? Deletes CANNOT be undone.
                </span>
              </div>
            </div>

            <div className={DeleteMenuStyle["delete-cancel-button-container"]}>
              <div className={DeleteMenuStyle["delete-button-container"]}>
                <button
                  onClick={handleDeleteOverlay}
                  className={DeleteMenuStyle["cancel-button"]}
                >
                  <span className={DeleteMenuStyle["cancel-text"]}>Cancel</span>
                </button>
              </div>
              <div className={DeleteMenuStyle["cancel-button-container"]}>
                <button
                  onClick={handleDeleteClick}
                  className={DeleteMenuStyle["delete-button"]}
                >
                  <span className={DeleteMenuStyle["delete-text"]}>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteMenu;
