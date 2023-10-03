import { getDocs, collection, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchData = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    // console.log("q", querySnapshot);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log("items", items);
    return items; // Return the data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error so you can handle it in your component
  }
};
