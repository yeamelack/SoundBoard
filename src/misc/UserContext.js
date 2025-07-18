import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabase/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  const fetchUserInfo = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", user.sub)
      .single();

    if (!error && data) {
      let profilePicture = null;

      if (data.avatar) {
        const { data: imageData, error: imageError } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar);

        if (imageError) {
          console.error("Avatar image fetch error:", imageError);
        } else {
          profilePicture = imageData?.publicUrl ?? null;
        }
      }

      setUserInfo({
        username: data.username,
        auth0id: user.sub,
        profilePicturePath: data.avatar,
        profilePicture,
      });
    } else {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        refreshUserInfo: fetchUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
