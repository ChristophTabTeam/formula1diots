import React from "react";
import { useState, useEffect } from "react";

// Deine Komponenten importieren (Home, Login, CreateSeason, etc.)
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import CreateSeason from "../pages/Season/CreateSeason/Index";
// import RaceView from "../pages/RaceView";
import { useAuth } from "../context/authcontext";
import Season from "../pages/Season/Index";
import RaceResultsEntry from "../pages/Season/RaceResultsEntry";
import DriverLineup from "../pages/Season/DriverLineup";
import ChangePassword from "../pages/Auth/ChangePassword";
import DriverProfile from "../pages/Profile/DriverProfile";
import SeasonResults from "../pages/Season/SeasonResults";
import RaceResults from "../pages/Season/RaceResults";
import Rules from "../pages/Season/Rules";
import Statistic from "../pages/Season/Statistic";
import FastestLap from "../pages/Season/FastestLaps";

const routes: { [key: string]: () => React.JSX.Element } = {
  "/login": () => <Login />,
  "/change-password": () => (
    <PrivateRoute>
      <ChangePassword />
    </PrivateRoute>
  ),
  "/": () => (
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  ),
  "/season": () => (
    <PrivateRoute>
      <Season />
    </PrivateRoute>
  ),
  "/create-season": () => (
    <PrivateRoute>
      <CreateSeason />
    </PrivateRoute>
  ),
  "/season/:seasonId": () => {
    const seasonId = window.location.pathname.split("/")[2]; // Extrahiere die seasonId aus der URL
    return (
      <PrivateRoute>
        <SeasonResults seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/results-entry": () => {
    const seasonId = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <RaceResultsEntry seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/driver-lineup": () => {
    const seasonId = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <DriverLineup seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/rules": () => {
    const seasonId = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <Rules seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/statistic": () => {
    const seasonId = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <Statistic seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/fastest-laps": () => {
    const seasonId = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <FastestLap seasonId={seasonId} />
      </PrivateRoute>
    );
  },
  "/season/:seasonId/race/:id": () => {
    const seasonId = window.location.pathname.split("/")[2];
    const raceId = window.location.pathname.split("/")[4];
    return (
      <PrivateRoute>
        <RaceResults seasonId={seasonId} raceId={raceId} />
      </PrivateRoute>
    );
  },
  "/profile/:id": () => {
    const id = window.location.pathname.split("/")[2];
    return (
      <PrivateRoute>
        <DriverProfile id={id} />
      </PrivateRoute>
    );
  },
};

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated } = useAuth(); // Authentifizierungsstatus prüfen

  return isAuthenticated ? children : <NavigateToLogin />;
};

const NavigateToLogin = () => {
  useEffect(() => {
    window.history.pushState({}, "", "/login"); // Navigiere zur Login-Seite
  }, []);
  return <Login />;
};

const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const renderRoute = () => {
    const route = Object.keys(routes).find((route) => {
      // Wenn der Pfad eine dynamische Route ist, wie z.B. '/season/:seasonId/race/:id'
      if (route.includes(":")) {
        const regexRoute = route.replace(/:[^\s/]+/g, "([\\w-]+)");
        const regex = new RegExp(`^${regexRoute}$`);
        return regex.test(currentPath);
      }
      return route === currentPath;
    });

    return route ? routes[route]() : <div>404 - Page not found</div>;
  };

  return <>{renderRoute()}</>;
};

export default Router;
