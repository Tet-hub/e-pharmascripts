import { getDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/firebase";

export const fetchProductData = async (fetchId, collectionName) => {
  try {
    const productDocRef = doc(db, collectionName, fetchId);
    const productSnapshot = await getDoc(productDocRef);

    if (productSnapshot.exists()) {
      return { id: productSnapshot.id, ...productSnapshot.data() };
    } else {
      console.log("Product not found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};
