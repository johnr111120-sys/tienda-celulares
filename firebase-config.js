import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0YrXAOE7eg04N6c3ZqLsBUUz8VBfHD58",
  authDomain: "moises-celulares.firebaseapp.com",
  projectId: "moises-celulares",
  appId: "1:392580256106:web:e31ae4c958effb4eb91513"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
