
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAjbKqs9JACZ9MfvAIC9w4q7msIMucAZ70",
    authDomain: "finalproject2025-21466.firebaseapp.com",
    databaseURL: "https://finalproject2025-21466-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "finalproject2025-21466",
    storageBucket: "finalproject2025-21466.firebasestorage.app",
    messagingSenderId: "428524404570",
    appId: "1:428524404570:web:fd600e8aa4adc068457d63",
    measurementId: "G-X0SNC9RMJ5"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };
