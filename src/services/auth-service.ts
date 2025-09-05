'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const provider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string): Promise<{ error?: string }> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<{ error?: string }> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  try {
    await signInWithPopup(auth, provider);
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signOutUser(): Promise<{ error?: string }> {
  try {
    await signOut(auth);
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
