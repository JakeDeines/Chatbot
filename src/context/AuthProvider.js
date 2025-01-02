import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User state changed:", user);
      setCurrentUser(user);
      setLoading(false);
    });

    // Attempt to sign in anonymously if not already signed in
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in error:", error);
        setError(error.message);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 6000); // Clear error message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error, setError]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, error, setError, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
