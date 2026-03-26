import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB-yz6xNEKeazqvkVvfkGAQTLq3hNDJTKw",
  authDomain: "movi-app-f84b8.firebaseapp.com",
  projectId: "movi-app-f84b8",
  storageBucket: "movi-app-f84b8.firebasestorage.app",
  messagingSenderId: "778638907275",
  appId: "1:778638907275:web:5f56d51216829e4893c18e",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)