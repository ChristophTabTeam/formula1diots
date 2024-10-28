import React from "react";
import { useState, useEffect } from "react";

// Deine Komponenten importieren (Home, Login, CreateSeason, etc.)
import Home from "../pages/Home";
import Login from "../pages/Login";
import CreateSeason from "../pages/CreateSeason";
import ViewSeason from "../pages/ViewSeason";
// import RaceView from "../pages/RaceView";
import { useAuth } from "../context/authcontext";
import Season from "../pages/Season";
import RaceResultsEntry from "../pages/RaceResultsEntry";
import Profile from "../pages/Personal/Profile";
import DriverLineup from "../pages/DriverLineup";

const routes: { [key: string]: () => React.JSX.Element } = {
  "/login": () => <Login />,
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
        <ViewSeason seasonId={seasonId} />
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
  "/profile": () => (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  ),
  // "/season/:seasonId/race/:id": () => (
  //   <PrivateRoute>
  //     <RaceView />
  //   </PrivateRoute>
  // ),
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
