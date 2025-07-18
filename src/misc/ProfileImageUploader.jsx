// ProfileImageUploader.jsx
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ProfileImageUploaderStyle from "../styles/misc/ProfileImageUploader.module.css";
import supabase from "../supabase/supabaseClient";
import { useClickContext } from "./ClickContext";
import { useUser } from "./UserContext";

function ProfileImageUploader({ onFileSelect, previewImage }) {
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className={ProfileImageUploaderStyle["profile-image-uploader"]}>
      <label htmlFor="profileUpload" className={ProfileImageUploaderStyle["image-container"]}>
        {previewImage && (
          <img src={previewImage} alt="" className={ProfileImageUploaderStyle["profile-image"]} />
        )}
        <div className={ProfileImageUploaderStyle["overlay"]}>
          <FaCamera className={ProfileImageUploaderStyle["camera-icon"]} />
        </div>
      </label>
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default ProfileImageUploader;
