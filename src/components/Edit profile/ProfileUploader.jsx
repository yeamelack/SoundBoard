import React, { useState } from "react";
import supabase from "../../supabase/supabaseClient";
import "../../styles/Edit profile/ProfileUploader.css";

function ProfileUploader({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !user?.sub) {
      return;
    }

    const fileExt = selectedFile.name.split("|").pop();
    const hashUserId = btoa(user.sub).replace(/[/+=]/g, "_");
    const filePath = `${hashUserId}/avatar.${fileExt}`;
    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, selectedFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Upload failed.");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from("users")
      .update({ avatar: filePath })
      .eq("userid", user.sub);

    if (dbError) {
      console.error("DB update error:", dbError);
      alert("Failed to save avatar path to user profile.");
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setAvatarUrl(publicData.publicUrl);
    setSelectedFile(null);
    setUploading(false);
    setSaved(true);

    // Optional: auto-hide "Saved" after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {selectedFile && (
        <p style={{ marginTop: "10px" }}>Selected: {selectedFile.name}</p>
      )}

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: "100px",
            borderRadius: "50%",
            marginTop: "10px",
            "aspect-ratio": "1 / 1",
            "object-fit": "cover",
          }}
        />
      )}

      <button
        className="save-button"
        onClick={handleSave}
        disabled={!selectedFile || uploading}
        style={{ marginTop: "10px" }}
      >
        {uploading ? "Saving..." : saved ? "Saved!" : "Save"}
      </button>
    </div>
  );
}

export default ProfileUploader;
