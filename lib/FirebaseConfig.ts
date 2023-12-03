import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

// Firebaseの初期化を保証する関数です。
const initializeFirebase = () => {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
};

// Firebaseの初期化を実行します。
initializeFirebase();

// Firebase Appインスタンスを取得する関数です。
const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    throw new Error("Firebase app has not been initialized");
  }
  return firebaseApp;
};

// Firebase Authインスタンスを取得する関数です。
const getAuthInstance = (): Auth => {
  if (!auth) {
    initializeFirebase(); // 未初期化の場合は初期化を試みます。
    if (!auth) {
      throw new Error("Firebase auth has not been initialized");
    }
  }
  return auth;
};

// Firebase Firestoreインスタンスを取得する関数です。
const getFirestoreInstance = (): Firestore => {
  if (!firestore) {
    initializeFirebase(); // 未初期化の場合は初期化を試みます。
    if (!firestore) {
      throw new Error("Firebase firestore has not been initialized");
    }
  }
  return firestore;
};

export { getFirebaseApp, getAuthInstance, getFirestoreInstance };
