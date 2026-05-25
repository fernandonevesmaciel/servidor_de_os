// Importando as funções do SDK Modular do Firebase direto da web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// SUBSTITUA PELAS SUAS CHAVES DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAsPaudJM_GFStIuG7vXI1QqBnakRFdn6E",
  authDomain: "servidoros-74334.firebaseapp.com",
  projectId: "servidoros-74334",
  storageBucket: "servidoros-74334.firebasestorage.app",
  messagingSenderId: "734620337561",
  appId: "1:734620337561:web:8420e42dba53589b32ff08",
  measurementId: "G-EJR0TW7X5Q"
};

// Inicializando os serviços do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportando para usar em outros arquivos (como o auth.js)
export { app, auth, db, storage };