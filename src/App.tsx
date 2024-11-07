import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Router from "./components/Router";
import { AuthProvider, useAuth } from "./context/authcontext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { Driver } from "./interfaces/Driver";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [driverProfile, setDriverProfile] = useState<Driver>();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
        setIsDarkMode(driverData?.darkMode || false);
      }
    };

    fetchDriverProfile();
  }, [userId]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Aktualisiere das Dark Mode-Flag im Firestore
    if (userId) {
      const driverDocRef = doc(db, "drivers", userId);
      await updateDoc(driverDocRef, { darkMode: newDarkMode });
    }
  };

  return (
    <div className={`page ${isDarkMode ? "dark" : ""}`}>
      {isAuthenticated && driverProfile && (
        <div className="sidebar">
          <Nav
            darkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            userId={userId || ""}
            driverProfile={driverProfile}
          />
          <div className="version-wrapper">
            <p>Version 1.2.0</p>
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
      <AppContent />
    </AuthProvider>
  );
}

export default App;
