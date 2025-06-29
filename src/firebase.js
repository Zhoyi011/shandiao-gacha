import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjBXN3lSAvHAVFPKc1DcnoQqhyoPHbrNQ",
  authDomain: "sandiao-gacha.firebaseapp.com",
  projectId: "sandiao-gacha",
  storageBucket: "sandiao-gacha.firebasestorage.app",
  messagingSenderId: "122936633918",
  appId: "1:122936633918:web:7f73df2b7231aea7063f6f",
  measurementId: "G-8HGGDF6NBQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("登录失败:", error);
    return null;
  }
};

const signOutUser = async () => {
  await signOut(auth);
};

export { auth, signInWithGoogle, signOutUser };
