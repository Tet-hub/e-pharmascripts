import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const checkUserExists = async (email) => {
  try {
    const usersCollectionRef = collection(db, "users");
    const usersQuery = query(usersCollectionRef, where("email", "==", email));
    const userQuerySnapshot = await getDocs(usersQuery);
    return !userQuerySnapshot.empty; // Return true if the user exists, false otherwise
  } catch (error) {
    throw error;
  }
};
