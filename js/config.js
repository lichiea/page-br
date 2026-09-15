import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyApSslyH0-86f3_HQi_UgZbZg0P4DATwg0",
    authDomain: "rbpo-br.firebaseapp.com",
    projectId: "rbpo-br",
    storageBucket: "rbpo-br.firebasestorage.app",
    messagingSenderId: "827284844767",
    appId: "1:827284844767:web:b9f1878ad2145d636e396a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
