import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Benutzer registrieren
export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
    });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
  }
};

// Benutzer anmelden
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential; // Gibt die UserCredential zurück
  } catch (error) {
    console.error("Fehler bei der Anmeldung:", error);
    throw error; // Wirf den Fehler weiter, um ihn an anderer Stelle behandeln zu können
  }
};

// Benutzer abmelden
export const logoutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Fehler beim Abmelden:", error);
  }
};

// Benutzer Passwort Reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);
  }
};

// Passwort ändern
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  if (!auth.currentUser) return;
  
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(
    user.email as string,
    currentPassword
  );

  try {
    // Benutzer erneut authentifizieren
    await reauthenticateWithCredential(user, credential);
    // Passwort ändern
    await updatePassword(user, newPassword);
    console.log("Passwort erfolgreich geändert");
  } catch (error) {
    console.error("Fehler beim Passwort ändern:", error);
    throw error;
  }
};
