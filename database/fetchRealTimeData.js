import {
  onSnapshot, // Import onSnapshot from Firestore Lite
  collection,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchRealTimeData = (collectionName, callback) => {
  try {
    const q = query(collection(db, collectionName));

    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(items); // Pass the updated data to a callback function
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    throw error;
  }
};
