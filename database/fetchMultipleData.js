import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchMultipleDocumentsByIds = async (
  collectionName,
  documentIds
) => {
  try {
    const q = documentIds.map((docId) => doc(db, collectionName, docId));
    const documentSnapshots = await getDocs(
      collection(db, collectionName, ...q)
    );

    const documentsData = documentSnapshots.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }));

    return documentsData;
  } catch (error) {
    console.error(`Error fetching documents data: ${error}`);
    return [];
  }
};
