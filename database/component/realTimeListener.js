import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const setupFirestoreListener = (collectionName, callback) => {
  // Get a reference to Firestore
  const db = getFirestore();

  // Create a reference to the Firestore collection you want to listen to
  const collectionRef = collection(db, collectionName);

  // Fetch the initial data from Firestore
  collectionRef.get().then((querySnapshot) => {
    const initialData = [];
    querySnapshot.forEach((doc) => {
      initialData.push({ id: doc.id, ...doc.data() });
    });

    // Invoke the callback with the initial data
    callback(initialData);
  });

  // Set up a real-time listener for future changes
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    const updatedData = [];
    querySnapshot.forEach((doc) => {
      // Access individual document data here
      updatedData.push({ id: doc.id, ...doc.data() });
    });

    // Invoke the callback with the updated data
    callback(updatedData);
  });

  // Return the unsubscribe function to stop listening when needed
  return unsubscribe;
};

export default setupFirestoreListener;
