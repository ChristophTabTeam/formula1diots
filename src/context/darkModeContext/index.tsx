import React, { useEffect, useState } from "react";
import { DarkModeContext } from "./context";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../authcontext/useAuth";

// DarkModeProvider-Komponente
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = async (driverId: string) => {
    const newMode = !isDarkMode;
    const driverDocRef = doc(db, "drivers", driverId);
    await updateDoc(driverDocRef, { darkMode: newMode });
    setIsDarkMode(newMode);
  };

  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      if (user && user.email) {
        const userId = user.email.replace("@formula1diots.de", "");
        console.log("userId", userId);
        const driverDocRef = doc(db, "drivers", userId);
        const driverDoc = await getDoc(driverDocRef);
        if (driverDoc.exists()) {
          const darkMode = driverDoc.data()?.darkMode;
          setIsDarkMode(darkMode ?? false); // Setze isDarkMode auf den Firestore-Wert oder auf false, falls undefined
        }
      } else {
        console.error("User not logged in");
      }
    };

    fetchDarkModeSetting();
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode); // Dark Mode Klasse für den Body anpassen
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
