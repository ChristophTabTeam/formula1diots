import React from "react";
import "../styles/nav.scss";
import { useAuth } from "../context/authcontext";

const Nav: React.FC = () => {
  const {logout} = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="nav-scrollable position-relative">
      <nav className="flex-column">
        <div className="nav-item px-3">
          <a className="nav-link" href="/">
            <span className="icon-20pt" aria-hidden="true">
              home
            </span>{" "}
            Home
          </a>
        </div>

        <div className="nav-item px-3">
          <a className="nav-link" href="/season">
            <span className="icon-20pt" aria-hidden="true">
              calendar_month
            </span>{" "}
            Season
          </a>
        </div>

        <div className="nav-item px-3">
          <a className="nav-link" href="/profile">
            <span className="icon-20pt" aria-hidden="true">
              person
            </span>{" "}
            Profil
          </a>
        </div>

        {/* <div className="nav-item px-3">
          <a className="nav-link" href="/infos">
            <span className="icon-20pt" aria-hidden="true">
              info
            </span>{" "}
            Infos
          </a>
        </div> */}

        {/* <div className="nav-item px-3">
          <a className="nav-link" href="/settings">
            <span className="icon-20pt" aria-hidden="true">
              settings
            </span>{" "}
            Einstellungen
          </a>
        </div> */}
      </nav>
      <div className="nav-item px-3">
        <div className="nav-link" onClick={handleLogout}>
          <span className="icon-20pt" aria-hidden="true">
            logout
          </span>{" "}
          Logout
        </div>
      </div>
    </div>
  );
};

export default Nav;
