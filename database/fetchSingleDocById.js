import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchSingleDocumentById = async (fetchId, collectionName) => {
  try {
    const qeury = doc(db, collectionName, fetchId);
    const docSnapshot = await getDoc(qeury);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      console.log("Data not found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};
