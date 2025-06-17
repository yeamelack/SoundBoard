import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import UserPage from "./pages/UserProfile";
import UserRating from "./pages/UserRating";
import EditProfile from "./pages/EditProfile";
import ScrollToTop from "./misc/ScrollToTop";
import reportWebVitals from "./reportWebVitals";
import ProtectedRoute from "./auth/ProtectedRoute";

import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="soundboardmusic.us.auth0.com"
      clientId="gdWf1kjjKnYySAdB8h2XyKRAPZ7P8uQw"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://soundboardmusic/api",
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
