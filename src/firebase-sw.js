import { initializeApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const firebaseApp = initializeApp(firebaseAppConfig);

console.info("Firebase has been initialized");

export const dbFirebaseApp = getFirestore(firebaseApp);

export const storageFirebaseApp = getStorage(firebaseApp);

// Return url that is contained within the firebase cloud storage
export const getStorageFirebaseURL = async (location) => {
  const storageRef = ref(storageFirebaseApp, location);
  return await getDownloadURL(storageRef);
};

// Return data object from the firebase collection for a specific document with a filtered name
export const getCloudStorageDocData = async (name) => {
  const q = query(collection(dbFirebaseApp), where("name", "==", name));
  const qSnapshot = await getDocs(q);
  const docData = qSnapshot[0].data();

  return docData;
};
