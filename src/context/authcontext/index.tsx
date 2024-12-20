// authContext/index.tsx
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthContext } from "./context";
import { logError } from "../../utils/errorLogger";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUser(user);
                setUserLoggedIn(true);
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false);
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, []);

    const value = {
        isAuthenticated: userLoggedIn,
        user: currentUser,
        login: () => { /* implement login logic here */ },
        logout: async () => {
            try {
                await auth.signOut();
            } catch (error) {
                logError(error as Error, currentUser?.email?.replace("@formulaidiots.de", "") || "unknown", { context: "AuthProvider" });
                console.error("Error signing out:", error);
            }
        },
        displayName: currentUser?.displayName || null,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
