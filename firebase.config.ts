import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정 (환경변수 또는 직접 입력)
// 실제 배포 시에는 환경변수로 관리하세요
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEMO_KEY_REPLACE_THIS",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mobile-id-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mobile-id-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mobile-id-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 인스턴스
export const db = getFirestore(app);
