import React, { useEffect, useState } from "react";
import { DarkModeContext } from "./context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// DarkModeProvider-Komponente
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialisiere mit dem Wert aus dem localStorage, falls vorhanden
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = async (driverId: string) => {
    const newMode = !isDarkMode;
    const driverDocRef = doc(db, "drivers", driverId);
    await updateDoc(driverDocRef, { darkMode: newMode });
    setIsDarkMode(newMode);
  };

  useEffect(() => {
    const page = document.getElementById("page");
    if (page) {
      page.classList.toggle("dark", isDarkMode);
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
