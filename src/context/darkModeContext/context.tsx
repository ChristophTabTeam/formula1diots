import { createContext } from "react";

// Interface für den Dark Mode Context
interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: (driverId: string) => Promise<void>;
}

// Erstelle den Context mit einem Standardwert
export const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);
