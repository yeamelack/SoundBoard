import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();
  const disableFadePaths = ["/settings", /^\/[^/]+$/]; // disable on `/settings` and `/:username`

  const shouldFade = !disableFadePaths.some((path) =>
    path instanceof RegExp
      ? path.test(location.pathname)
      : location.pathname === path
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`page-wrapper ${shouldFade ? "fade-in" : "no-fade"}`}>
      <Outlet />
    </div>
  );
}

export default ScrollToTop;
