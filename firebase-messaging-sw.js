importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB0YrXAOE7eg04N6c3ZqLsBUUz8VBfHD58",
  authDomain: "moises-celulares.firebaseapp.com",
  projectId: "moises-celulares",
  storageBucket: "moises-celulares.firebasestorage.app",
  messagingSenderId: "392580256106",
  appId: "1:392580256106:web:e31ae4c958effb4eb91513"
});

const messaging = firebase.messaging();
