import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApSslyH0-86f3_HQi_UgZbZg0P4DATwg0",
  authDomain: "rbpo-br.firebaseapp.com",
  projectId: "rbpo-br",
  storageBucket: "rbpo-br.firebasestorage.app",
  messagingSenderId: "827284844767",
  appId: "1:827284844767:web:b9f1878ad2145d636e396a"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Элементы DOM
const authScreen = document.getElementById('auth-screen');
const userScreen = document.getElementById('user-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const userEmail = document.getElementById('user-email');
const secretText = document.getElementById('secret-text');
const tabs = document.querySelectorAll('.tab');

// Переключение вкладок
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tabName === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    });
});

// Регистрация
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    
    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        successDiv.textContent = 'Регистрация успешна! Теперь войдите в систему.';
        registerForm.reset();
        
        setTimeout(() => {
            tabs[0].click();
        }, 2000);
    } catch (error) {
        errorDiv.textContent = translateError(error.code);
    }
});

// Вход
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.textContent = '';

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        errorDiv.textContent = translateError(error.code);
    }
});

// Выход
logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

// Слушатель состояния авторизации
onAuthStateChanged(auth, async (user) => {
    if (user) {
        authScreen.classList.add('hidden');
        userScreen.classList.remove('hidden');
        userEmail.textContent = user.email;
        await loadSecretData();
    } else {
        authScreen.classList.remove('hidden');
        userScreen.classList.add('hidden');
        loginForm.reset();
    }
});

// Загрузка секретных данных из Firestore
async function loadSecretData() {
    try {
        const docRef = doc(db, 'secrets', 'protected_content');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            secretText.textContent = docSnap.data().content;
        } else {
            secretText.textContent = 'Документ не найден в базе данных. Проверьте настройки Firestore.';
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        secretText.textContent = 'Ошибка загрузки данных (проверьте правила Firestore): ' + error.message;
    }
}

// Перевод ошибок Firebase на русский
function translateError(errorCode) {
    const errors = {
        'auth/email-already-in-use': 'Этот email уже зарегистрирован',
        'auth/invalid-email': 'Некорректный email',
        'auth/weak-password': 'Пароль слишком короткий (минимум 6 символов)',
        'auth/user-not-found': 'Пользователь не найден',
        'auth/wrong-password': 'Неверный пароль',
        'auth/invalid-credential': 'Неверный email или пароль',
        'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже'
    };
    return errors[errorCode] || 'Произошла ошибка: ' + errorCode;
}
