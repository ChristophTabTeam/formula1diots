import React, { useEffect, useState } from "react";
import "../styles/nav.scss";
import { useAuth } from "../context/authcontext";

const Nav: React.FC = () => {
  const { logout, user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    if (user && user.email) {
      setUserId(user.email.replace("@formula1diots.de", ""));
    }
    const windowPath = window.location.pathname.split("/")[1] || "";
    setPath(windowPath);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="nav-scrollable position-relative">
      <nav className="flex-column">
        <div className="nav-item px-3">
          <a className={`nav-link ${path === "" ? "active" : ""}`} href="/">
            <span className="icon-20pt" aria-hidden="true">
              home
            </span>{" "}
            Home
          </a>
        </div>

        <div className="nav-item px-3">
          <a
            className={`nav-link ${path === "season" ? "active" : ""}`}
            href="/season"
          >
            <span className="icon-20pt" aria-hidden="true">
              calendar_month
            </span>{" "}
            Season
          </a>
        </div>

        <div className="nav-item px-3">
          <a
            className={`nav-link ${path === "profile" ? "active" : ""}`}
            href={`/profile/${userId}`}
          >
            <span className="icon-20pt" aria-hidden="true">
              person
            </span>{" "}
            Profil
          </a>
        </div>
      </nav>
      <nav className="lower-nav">
        {/* <div className="nav-item px-3">
          <a className="nav-link" href="/settings">
            <span className="icon-20pt" aria-hidden="true">
              settings
            </span>{" "}
            Settings
          </a>
        </div> */}
        <div className="nav-item px-3">
          <div className="nav-link" onClick={handleLogout}>
            <span className="icon-20pt" aria-hidden="true">
              logout
            </span>{" "}
            Logout
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
