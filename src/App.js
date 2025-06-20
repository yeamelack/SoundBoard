import "./App.css";
import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import UserPage from "./pages/UserProfile";
import UserRating from "./pages/UserRating";
import EditProfile from "./pages/EditProfile";
import ScrollToTop from "./misc/ScrollToTop";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabase from "./supabase/supabaseClient";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const insertUser = async () => {
      if (!isAuthenticated || !user) return;

      const { data, error } = await supabase
        .from("users")
        .select("userid")
        .eq("userid", user.sub)
        .single();

      if (error) {
        console.error("Error checking for user:", error.message);
        setDbError(error);
        return;
      }

      if (!data) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            userid: user.sub,
            numberofrating: 0,
            numberofreviews: 0,
          },
        ]);

        if (insertError) {
          console.error("Error inserting user:", insertError.message);
          setDbError(insertError);
        } else {
          setDbError(null);
        }
      } else {
        setDbError(null);
      }
    };

    insertUser();
  }, [isAuthenticated, user]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ScrollToTop />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: ":artistId/album/:albumId",
          element: <AlbumPage />,
        },
        {
          path: ":username",
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: ":username/:ratingid",
          element: (
            <ProtectedRoute>
              <UserRating />
            </ProtectedRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  if (isLoading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}

export default App;
