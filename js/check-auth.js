import { auth } from './config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Проверка авторизации на защищённых страницах
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Не авторизован — редирект на страницу входа
        window.location.href = 'index.html';
    } else {
        // Показываем email пользователя, если есть элемент
        const emailEl = document.getElementById('user-email');
        if (emailEl) {
            emailEl.textContent = user.email;
        }
    }
});

// Обработчик кнопки выхода
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = 'index.html';
    });
}
