import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Router from "./components/Router";
import { AuthProvider } from "./context/authcontext";
import { useAuth } from "./context/authcontext/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { Driver } from "./interfaces/Driver";
import { DarkModeProvider, } from "./context/darkModeContext";
import { useDarkMode } from "./context/darkModeContext/useDarkMode";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useDarkMode();  // Hole den Dark Mode Zustand aus dem Provider
  const [userId, setUserId] = useState<string | null>(null);
  const [driverProfile, setDriverProfile] = useState<Driver>();

  useEffect(() => {
    if (user && user.email) {
      setUserId(user.email.replace("@formula1diots.de", ""));
    }
  }, [user]);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      if (userId) {
        const driverDoc = doc(db, "drivers", userId);
        const driverData = (await getDoc(driverDoc)).data() as Driver;
        setDriverProfile(driverData);
      }
    };

    fetchDriverProfile();
  }, [userId]);

  return (
    <div className={`page ${isDarkMode ? "dark" : ""}`}>
      {isAuthenticated && driverProfile && (
        <div className="sidebar">
          <Nav userId={userId || ""} driverProfile={driverProfile} />
          <div className="version-wrapper">
            <p>Version 1.2.1</p>
          </div>
        </div>
      )}
      <main style={{ position: "relative" }}>
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
