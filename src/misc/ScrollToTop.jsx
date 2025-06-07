import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";

export default function  ScrollToTopLayout() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false); // Start with hidden
    const timeout = setTimeout(() => setShow(true), 450); // Delay fade-in

    // Scroll to top every route change
    window.scrollTo(0, 0);

    return () => clearTimeout(timeout); // Clean up
  }, [location.pathname]);

  return (
    <div className={`page-wrapper ${show ? "fade-in" : "fade-out"}`}>
      <Outlet />
    </div>
  );
}
