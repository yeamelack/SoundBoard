import "./index.css";
import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import UserPage from "./pages/UserProfile";
import UserRating from "./pages/UserRating";
import EditProfile from "./pages/EditProfile";


import ScrollToTop from "./misc/ScrollToTop";
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
        path: "album",
        element: <AlbumPage />,
      },
      {
        path: ":artistId/album/:albumId",
        element: <AlbumPage />,
      },
      {
        path: ":username",
        element: <UserPage />,
      },

      {
        path: ":username/:ratingid",
        element: <UserRating />,
      },

      {
        path: "/settings",
        element: <EditProfile />,
      },
    ],

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
