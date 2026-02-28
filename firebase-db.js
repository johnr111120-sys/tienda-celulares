import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0YrXAOE7eg04N6c3ZqLsBUUz8VBfHD58",
  authDomain: "moises-celulares.firebaseapp.com",
  projectId: "moises-celulares",
  appId: "1:392580256106:web:e31ae4c958effb4eb91513"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
