import { useContext } from "react";
import { DarkModeContext } from "./context";
  
  // Custom Hook zum Verwenden des Dark Mode Contexts
  export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
      throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
  };