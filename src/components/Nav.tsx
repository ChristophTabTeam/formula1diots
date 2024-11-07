import React, { useEffect, useState } from "react";
import "../styles/nav.scss";
import { useAuth } from "../context/authcontext/useAuth";
import f1Logo from "../assets/F1.svg";
import { Driver } from "../interfaces/Driver";
import { useDarkMode } from "../context/darkModeContext/useDarkMode";

interface NavProps {
  userId: string;
  driverProfile: Driver;
}

const Nav: React.FC<NavProps> = ({ userId, driverProfile }) => {
  const { logout } = useAuth();
  const [path, setPath] = useState<string>("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const windowPath = window.location.pathname.split("/")[1] || "";
    setPath(windowPath);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="nav-scrollable position-relative">
      <nav className="flex-column">
        <a className="nav-logo-wrapper" href="/">
          <img src={f1Logo} alt="F1Diots Logo" />
          <p>Formula1diots</p>
        </a>
        <div className="nav-item px-3">
          <a className={`nav-link f1-regular ${path === "" ? "active" : ""}`} href="/">
            <span className="icon-20pt" aria-hidden="true">
              home
            </span>{" "}
            Home
          </a>
        </div>

        <div className="nav-item px-3">
          <a
            className={`nav-link f1-regular ${path === "season" ? "active" : ""}`}
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
            className={`nav-link f1-regular ${path === "races" ? "active" : ""}`}
            href="/races"
          >
            <span className="icon-20pt" aria-hidden="true">
              flag
            </span>{" "}
            Races
          </a>
        </div>

        <div className="nav-item px-3">
          <a
            className={`nav-link f1-regular ${path === "profile" ? "active" : ""}`}
            href={`/profile/${userId}`}
          >
            <img src={driverProfile?.profilePictureUrl} alt="Profile" className="nav-profile-pic" />
            Profil
          </a>
        </div>
      </nav>
      <nav className="lower-nav">
        <div className="nav-item nav-dark-mode-switch" style={{ color: "white"}}>
          <span className="icon-20pt" aria-hidden="true">light_mode</span>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={() => toggleDarkMode(userId)} />
            <span className="switch-span"></span>
          </label>
          <span className="icon-20pt" aria-hidden="true">dark_mode</span>
        </div>
        <div className="nav-item px-3">
          <div className="nav-link f1-regular" onClick={handleLogout}>
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
