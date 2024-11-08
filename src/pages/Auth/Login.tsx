import React, { useEffect, useState } from "react";
import { loginUser } from "../../firebase/auth";
import { useAuth } from "../../context/authcontext/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import f1Logo from "../../assets/F1.svg";

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const extractUsername = (email: string): string => {
    return email.split("@")[0]; // Nimmt nur den Teil vor dem @
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await loginUser(email, password);

        // Verwende den Teil der E-Mail vor dem @ als Dokumenten-ID
        const username = extractUsername(email);

        // Überprüfen, ob der Benutzer bereits in der 'players'-Collection existiert
        const userDocRef = doc(db, "drivers", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Wenn der Benutzer nicht existiert, füge ihn hinzu
          await setDoc(userDocRef, {
            email: email,
            createdAt: new Date(),
            id: username,
            isPlayer: true,
            // Weitere Benutzerinformationen hier speichern
          });
        }

        // Weiterleiten nach erfolgreichem Login
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (error: unknown) {
        // Fehlerbehandlung
        if (error instanceof Error) {
          if (error.message.includes("auth/invalid-credential")) {
            setError(
              "Fehler bei der Anmeldung: Ungültige Anmeldeinformationen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort. " +
                error.message
            );
          } else {
            setError(
              "Fehler bei der Anmeldung. Bitte versuchen Sie es später erneut. " +
                error.message
            );
          }
        } else {
          setError("Ein unbekannter Fehler ist aufgetreten.");
        }
        setIsSigningIn(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      window.history.pushState({}, "", "/home");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [isAuthenticated]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title display-6 f1-regular">
          <img className="login-image" src={f1Logo} alt="F1 Logo" />
          Formula1diots
        </h1>
        <h2 className="login-title display-4 f1-regular">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label f1-regular">Email:</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label f1-regular">Password:</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="********"
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <a href="/privacy-policy" className="hyperlink" style={{textAlign: "center", marginTop: 20}}>Privacy Policy</a>
        {/* <div className="login-links-wrapper">
          <p>
            <a className="forgot-password-link" href="/reset-password">
              Passwort vergessen?
            </a>
          </p>
        </div> */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
