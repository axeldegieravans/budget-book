"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";

export async function register(email: string, password: string, displayName: string) {
  const { auth, db } = assertFirebaseConfigured();
  const result = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(result.user, { displayName });
  await setDoc(doc(db, "users", result.user.uid), {
    email: result.user.email,
    emailLowercase: email.toLowerCase(),
    displayName,
    createdAt: serverTimestamp(),
  });

  return result.user;
}

export async function login(email: string, password: string) {
  const { auth } = assertFirebaseConfigured();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logout() {
  const { auth } = assertFirebaseConfigured();
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const { auth } = assertFirebaseConfigured();
  return onAuthStateChanged(auth, callback);
}
