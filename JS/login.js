
/**
 * ניהול דף הכניסה: זיהוי משתמש קיים, ברכת שלום ומעבר למשחק.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const nameInput = document.getElementById('playerName');
    const welcomeMsg = document.getElementById('welcomeMessage');

    /**
     * אירוע קלט לבדיקה האם השם קיים ב-localStorage 
     */
    nameInput.addEventListener('input', () => {
        // שליפת השם השמור מה-localStorage 
        const savedName = localStorage.getItem('user_name');
        const currentInput = nameInput.value.trim();

        if (savedName && currentInput === savedName) {
            welcomeMsg.textContent = `טוב לראות אותך שוב, ${savedName}!`;
            welcomeMsg.style.color = "#4f46e5";
        } else if (currentInput.length > 0) {
            welcomeMsg.textContent = `שלום ${currentInput}! שמחים שהצטרפת.`;
            welcomeMsg.style.color = "#22c55e";
        } else {
            welcomeMsg.textContent = " אנא הכנס שם כדי להתחיל";
            welcomeMsg.style.color = "white";
        }
    });

    /**
     * שליחת הטופס ומעבר דף עם פרמטרים  
     */
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // שימוש ב-preventDefault 

        const name = nameInput.value.trim();
        const level = document.getElementById('difficulty').value;

        // שמירת השם בזיכרון המקומי 
        localStorage.setItem('user_name', name);

        // מעבר לדף המשחק בתיקיית pages עם הפרמטרים בשורת הכתובת 
        window.location.href = `HTML/game.html?name=${encodeURIComponent(name)}&level=${level}`;
    });
});