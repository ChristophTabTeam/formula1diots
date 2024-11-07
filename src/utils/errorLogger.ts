import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const logError = async (
  error: Error,
  userId: string | null,
  additionalInfo: Record<string, any> = {}
) => {
  try {
    await addDoc(collection(db, "errorLogs"), {
      userId: userId || "anonymous",
      timestamp: new Date(),
      errorType: error.name,
      message: error.message,
      stackTrace: error.stack,
      ...additionalInfo,
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }
};