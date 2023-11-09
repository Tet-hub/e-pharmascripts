import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const updateById = async (
  documentId,
  collectionName,
  fieldName,
  newValue
) => {
  const documentRef = doc(db, collectionName, documentId);

  try {
    // Get the current document data
    const documentSnapshot = await getDoc(documentRef);
    if (!documentSnapshot.exists()) {
      console.error(`Document with ID '${documentId}' not found.`);
      return; // Return early if the document doesn't exist
    }
    // Create an object with the field to update
    const updatedFields = { [fieldName]: newValue };

    // Update the document in Firestore
    await updateDoc(documentRef, updatedFields);

    console.log(`Document field '${fieldName}' updated successfully.`);
  } catch (error) {
    console.error(`Error updating document field '${fieldName}':`, error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};
