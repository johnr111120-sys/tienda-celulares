import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0YrXAOE7eg04N6c3ZqLsBUUz8VBfHD58",
  authDomain: "moises-celulares.firebaseapp.com",
  databaseURL: "https://moises-celulares-default-rtdb.firebaseio.com", // Agregada
  projectId: "moises-celulares",
  storageBucket: "moises-celulares.appspot.com", // Recomendado agregar
  appId: "1:392580256106:web:e31ae4c958effb4eb91513"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Inicializamos la base de datos

export { auth, db }; // Exportamos ambos
