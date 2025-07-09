import DeleteMenuStyle from "../../styles/UserRating/DeleteMenu.module.css";
import supabase from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

function DeleteMenu({ handleDeleteOverlay, reviewId }) {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const deleteReview = async () => {
    const { error } = await supabase
      .from("musicreviews")
      .delete()
      .eq("albumreviewid", reviewId);

    if (error) {
      console.error("Failed to delete review", error);
      return;
    }

    navigate(`/${user.name}`, {
      state: { showDeleteConfirmation: true },
    });
  };

  return (
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
                onClick={deleteReview}
                className={DeleteMenuStyle["delete-button"]}
              >
                <span className={DeleteMenuStyle["delete-text"]}>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteMenu;
