// authContext/index.tsx
import { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthContext } from "./context";

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
