import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchDataById = async (passedId, collectionName) => {
  try {
    const productQuery = query(
      collection(db, collectionName),
      where("id", "==", passedId)
    );

    const querySnapshot = await getDocs(productQuery);
    console.log("backedFetch id", passedId);
    if (querySnapshot.size === 0) {
      console.log("Data not found in Firestore");
      return null;
    }

    // Assuming product IDs are unique, you can simply return the first document
    const dataDoc = querySnapshot.docs[0];
    return dataDoc.data();
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};
