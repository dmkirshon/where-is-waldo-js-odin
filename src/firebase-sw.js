import { initializeApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  addDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const firebaseApp = initializeApp(firebaseAppConfig);

export const dbFirebaseApp = getFirestore(firebaseApp);

export const storageFirebaseApp = getStorage(firebaseApp);

// Return url that is contained within the firebase cloud storage
export const getStorageFirebaseURL = async (location) => {
  const storageRef = ref(storageFirebaseApp, location);
  return await getDownloadURL(storageRef);
};

// Return document data array from the specified firebase collection
export const getCloudStorageDocData = async (collectionPath) => {
  const q = query(collection(dbFirebaseApp, collectionPath));
  const qSnapshot = await getDocs(q);

  let docData = [];
  let count = 0;
  qSnapshot.forEach((doc) => {
    docData[count] = doc.data();
    count++;
  });

  return docData;
};

// Adds new document to specified firebase collection with provided data
export const updateCloudStorageWithDocData = async (data, collectionPath) => {
  const collectionRef = collection(dbFirebaseApp, collectionPath);
  await addDoc(collectionRef, data);
};
