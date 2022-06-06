import { initializeApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const firebaseApp = initializeApp(firebaseAppConfig);

console.info("Firebase has been initialized");

export const dbFirebaseApp = getFirestore(firebaseApp);
export const storageFirebaseApp = getStorage(firebaseApp);
export const getStorageFirebaseURL = async (location) => {
  const storageRef = ref(storageFirebaseApp, location);
  return await getDownloadURL(storageRef);
};
