'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }_from_ 'firebase/firestore';

const firebaseConfig = {
  projectId: 'geminiflow-a5d2e',
  appId: '1:25065511329:web:9f27cece84f1e9d487d3e0',
  storageBucket: 'geminiflow-a5d2e.firebasestorage.app',
  apiKey: 'AIzaSyBFiqaSXQX95aApyENoI0Vfft62GKEcIDg',
  authDomain: 'geminiflow-a5d2e.firebaseapp.com',
  messagingSenderId: '25065511329',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
