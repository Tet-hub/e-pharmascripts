// backend.js

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchUserData = async (id, collectionName) => {
  try {
    const userDoc = doc(collection(db, collectionName), id);
    const userSnapshot = await getDoc(userDoc);
    // console.log("userId from backend", userSnapshot);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log("User not found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchBranchesData = async (
  passedData,
  collectionName,
  fieldName
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, "==", passedData)
    );
    const querySnapshot = await getDocs(q);

    const branchesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return branchesData;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};
