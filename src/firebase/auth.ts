import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Benutzer registrieren
export const registerUser = async (email: string, password: string, name: string) => {
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

// Benutzer mit Google anmelden
export const loginUserWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Benutzerdaten in Firestore speichern
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      // Weitere benutzerspezifische Daten hier hinzufügen, falls nötig
    }, { merge: true }); // merge: true aktualisiert die bestehenden Daten, anstatt sie zu überschreiben

    return result;
  } catch (error) {
    console.error("Fehler bei der Anmeldung mit Google:", error);
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
