import "./App.css";
import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import UserPage from "./pages/UserProfile";
import UserRating from "./pages/UserRating";
import EditProfile from "./pages/EditProfile";
import Header from "./components/Header/Header";
import ScrollToTop from "./misc/ScrollToTop";
import ProtectedRoute from "./auth/ProtectedRoute";
import SetupProfile from "./pages/SetupProfile";
import { ClickProvider } from "./misc/ClickContext"; // or wherever your ClickContext is
import { UserProvider } from "./misc/UserContext";
import UserReviews from "./pages/UserReview";

import { useAuth0 } from "@auth0/auth0-react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabase from "./supabase/supabaseClient";
import Rating from "./pages/Rating";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!isAuthenticated || !user) return;

      // Skip check if already on setup page
      if (window.location.pathname === "/setup") return;

      const { data, error } = await supabase
        .from("users")
        .select("userid")
        .eq("userid", user.sub)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error.message);
        setDbError(error);
        return;
      }

      if (!data) {
        // Redirect new users to setup page
        window.location.href = "/setup";
      }
    };

    checkUser();
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
          path: "/artist/:artistId",
          element: (
              <ArtistProfile/>
          ),
        },
        {
          path: ":username",
          element: <UserPage />,
        },
        {
          path: ":username/rating/",
          element: <Rating />,
        },
        {
          path: ":username/rating/:reviewId",
          element: <UserRating />,
        },
        {
          path: "/:username/reviews/",
          element: <UserReviews />,
        },
        {
          path: "/setup",
          element: (
            <ProtectedRoute>
              <SetupProfile />
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

  return (
    <ClickProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ClickProvider>
  );
}

export default App;
