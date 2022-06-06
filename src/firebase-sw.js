import { initializeApp } from "firebase/app";
import { firebaseAppConfig } from "./firebase-config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseApp = initializeApp(firebaseAppConfig);

console.info("Firebase has been initialized");

export const dbFirebaseApp = getFirestore(firebaseApp);
export const storageFirebaseApp = getStorage(firebaseApp);
