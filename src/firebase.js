import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBT0B2K3HI7Th4a0mwFW1E9TfSU1yoz-o8",
  authDomain: "db-user-auth.firebaseapp.com",
  projectId: "db-user-auth",
  storageBucket: "db-user-auth.appspot.com",
  messagingSenderId: "637617302235",
  appId: "1:637617302235:web:9066dfdc3e5e6376c5fafe",
  measurementId: "G-M38N62ENRT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

const useAuth = () => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User state changed:", user);
      setUser(user);
    });

    return () => {
      console.log("Unsubscribing from user state changes");
      unsubscribe();
    };
  }, []);
  return user;
};

export { app, auth, useAuth };
