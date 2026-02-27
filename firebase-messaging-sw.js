importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBXzbZY5CRIM6M5LmjSiX6qFXf9cdloUg0",
  authDomain: "admin-moises-celulares.firebaseapp.com",
  projectId: "admin-moises-celulares",
  storageBucket: "admin-moises-celulares.firebasestorage.app",
  messagingSenderId: "657071812173",
  appId: "1:657071812173:web:2c5522afdbd29fbb607604"
});

const messaging = firebase.messaging();
