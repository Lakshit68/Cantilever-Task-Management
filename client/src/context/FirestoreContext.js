import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useAuth } from './AuthContext'; // Import useAuth from AuthContext

// Firebase configuration and initialization (assuming these are globally available or passed)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const FirestoreContext = createContext(null);

export const FirestoreProvider = ({ children }) => {
  const { currentUser, loadingAuth } = useAuth(); // Use useAuth to get current user
  const [tasks, setTasks] = useState([]);
  const [firestoreError, setFirestoreError] = useState(null);
  const userId = currentUser?.uid || 'anonymous'; // Use current user's UID or 'anonymous'

  useEffect(() => {
    if (loadingAuth || !currentUser) return;

    // Define the collection path based on whether the user is authenticated or anonymous
    const tasksCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/tasks`);
    const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setFirestoreError(null);
    }, (error) => {
      console.error("Firestore Snapshot Error:", error);
      setFirestoreError(error.message);
    });

    return unsubscribe;
  }, [currentUser, loadingAuth, userId]);

  const addTask = async (title) => {
    setFirestoreError(null);
    if (!currentUser) {
      setFirestoreError("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/tasks`), {
        title,
        completed: false,
        createdAt: serverTimestamp(),
        userId: currentUser.uid // Store userId with the task
      });
    } catch (error) {
      console.error("Add Task Error:", error);
      setFirestoreError(error.message);
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    setFirestoreError(null);
    if (!currentUser) {
      setFirestoreError("User not authenticated.");
      return;
    }
    try {
      await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/tasks`, id), updates);
    } catch (error) {
      console.error("Update Task Error:", error);
      setFirestoreError(error.message);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    setFirestoreError(null);
    if (!currentUser) {
      setFirestoreError("User not authenticated.");
      return;
    }
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/tasks`, id));
    } catch (error) {
      console.error("Delete Task Error:", error);
      setFirestoreError(error.message);
      throw error;
    }
  };

  return (
    <FirestoreContext.Provider value={{ tasks, firestoreError, addTask, updateTask, deleteTask }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  return useContext(FirestoreContext);
};
