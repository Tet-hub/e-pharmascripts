import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchDocByCondition = async (collectionName, conditions) => {
  try {
    let queryRef = collection(db, collectionName);

    // Build the query dynamically based on the provided conditions
    conditions.forEach((condition) => {
      const { fieldName, operator, value } = condition;
      queryRef = query(queryRef, where(fieldName, operator, value));
    });

    const querySnapshot = await getDocs(queryRef);

    const collectionData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return collectionData;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};
