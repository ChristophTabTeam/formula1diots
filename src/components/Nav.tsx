import React from "react";

const Nav: React.FC = () => {
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
          <a className="nav-link" href="results-entry">
            <span className="icon-20pt" aria-hidden="true">
              directions_car
            </span>{" "}
            Results Entry
          </a>
        </div>

        <div className="nav-item px-3">
          <a className="nav-link" href="/races">
            <span className="icon-20pt" aria-hidden="true">
              sports_score
            </span>{" "}
            Races
          </a>
        </div>

        <div className="nav-item px-3">
          <a className="nav-link" href="/infos">
            <span className="icon-20pt" aria-hidden="true">
              info
            </span>{" "}
            Infos
          </a>
        </div>

        <div className="nav-item px-3">
          <a className="nav-link" href="/settings">
            <span className="icon-20pt" aria-hidden="true">
              settings
            </span>{" "}
            Einstellungen
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
