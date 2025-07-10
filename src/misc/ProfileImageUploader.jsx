// ProfileImageUploader.jsx
import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ProfileImageUploaderStyle from "../styles/misc/ProfileImageUploader.module.css";

function ProfileImageUploader() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className={ProfileImageUploaderStyle["profile-image-uploader"]}>
      <label
        htmlFor="profileUpload"
        className={ProfileImageUploaderStyle["image-container"]}
      >
        {image && (
          <img
            src={image || "https://via.placeholder.com/150"} // default image
            alt=""
            className={ProfileImageUploaderStyle["profile-image"]}
          />
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
