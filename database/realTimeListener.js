import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const setupRealtimeListener = (id, collectionName, callback) => {
  const docRef = doc(db, id, collectionName);
  const unsubscribe = onSnapshot(
    docRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        callback(data);
      } else {
        // Handle the case where the document doesn't exist
        console.log(`Document with ID ${id} not found in Firestore.`);
        callback(null);
      }
    },
    (error) => {
      // Handle any errors that occur while listening to changes
      console.error(
        `Error listening to Firestore document with ID ${id}:`,
        error
      );
    }
  );

  // Return the unsubscribe function if you want to stop listening later
  return unsubscribe;
};
