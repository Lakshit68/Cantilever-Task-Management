import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration and initialization (assuming these are globally available or passed)
// In a real project, you'd typically import these from a separate firebaseConfig.js file.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // Sign in anonymously if no user is logged in and no custom token is provided
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          setAuthError(error.message);
        }
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password) => {
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Registration Error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, authError, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
