import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabase/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  useEffect(() => {
    console.log("Auth0 user in context:", user);

    const fetchUserInfo = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userid", user.sub)
        .single();

      console.log("Supabase user fetch result:", { data, error });

      if (!error && data) {
        setUserInfo({ username: data.username, auth0id: user.sub });

        if (data.avatar) {
          const { data: imageData, error: imageError } = supabase.storage
            .from("avatars")
            .getPublicUrl(data.avatar);

          if (imageError) {
            console.error("Avatar image fetch error:", imageError);
          } else {
            setUserProfilePicture(imageData?.publicUrl ?? null);
          }
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <UserContext.Provider
      value={{ ...userInfo, profilePicture: userProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
