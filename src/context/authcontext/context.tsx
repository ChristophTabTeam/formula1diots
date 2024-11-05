import { User } from "firebase/auth";
import { createContext } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: () => void;
    logout: () => void;
    displayName: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);