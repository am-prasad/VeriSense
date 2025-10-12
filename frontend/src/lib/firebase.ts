// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ==================================================
// 🔧 Firebase Config (from .env file)
// ==================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ==================================================
// 🚀 Initialize Firebase
// ==================================================
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==================================================
// 🌐 OAuth Providers
// ==================================================
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ==================================================
// 💾 Helper: Save or Update User in Firestore
// ==================================================
const saveUserToDB = async (user: User) => {
  if (!user?.uid) return;
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email || "",
        photo: user.photoURL || "",
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("❌ Firestore user save error:", error);
  }
};

// ==================================================
// 🔑 GOOGLE SIGN-IN
// ==================================================
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await saveUserToDB(user);
    return user;
  } catch (error: any) {
    if (
      error.code === "auth/cancelled-popup-request" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      console.warn("⚠️ Google sign-in cancelled by user.");
      return null;
    }
    console.error("❌ Google sign-in error:", error);
    throw error;
  }
};

// ==================================================
// 🐙 GITHUB SIGN-IN
// ==================================================
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    await saveUserToDB(user);
    return user;
  } catch (error: any) {
    if (
      error.code === "auth/cancelled-popup-request" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      console.warn("⚠️ GitHub sign-in cancelled by user.");
      return null;
    }
    console.error("❌ GitHub sign-in error:", error);
    throw error;
  }
};

// ==================================================
// 📧 EMAIL + PASSWORD SIGN-UP
// ==================================================
export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user, { displayName: name });
    await saveUserToDB(user);
    return user;
  } catch (error) {
    console.error("❌ Email sign-up error:", error);
    throw error;
  }
};

// ==================================================
// 🔐 EMAIL + PASSWORD LOGIN
// ==================================================
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await saveUserToDB(user);
    return user;
  } catch (error) {
    console.error("❌ Email login error:", error);
    throw error;
  }
};
// Get the currently signed-in user once
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // stop listening after first call
      resolve(user);
    });
  });
};


// ==================================================
// 🚪 LOGOUT
// ==================================================
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
};

// ==================================================
// 👀 AUTH STATE LISTENER (real-time)
// ==================================================
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
