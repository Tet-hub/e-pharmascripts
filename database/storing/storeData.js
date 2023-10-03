import { db } from "../../firebase/firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
export const storeProductData = async (collectionName, data) => {
  try {
    // Get a reference to the Firestore collection
    const collectionRef = collection(db, collectionName);

    // Add the data to the collection
    const docRef = await addDoc(collectionRef, data);

    // console.log("Document added with ID: ", docRef.id);
    return docRef.id; // Return the document ID if needed
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
