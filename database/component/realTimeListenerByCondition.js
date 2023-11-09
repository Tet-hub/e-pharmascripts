//screens using the listener
//homescreen or main pharmacies
//branch or sellers
//Display products  or products

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const listenForItem = (collectionName, conditions, callback) => {
  const docRef = collection(db, collectionName);

  // Build the query dynamically based on the provided conditions
  let queryRef = docRef;
  conditions.forEach((condition) => {
    const { fieldName, operator, value } = condition;
    queryRef = query(queryRef, where(fieldName, operator, value));
  });

  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    const item = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      item.push({ id: doc.id, ...data });
    });
    callback(item);
  });

  return unsubscribe;
};
