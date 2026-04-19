
/**
 * ניהול דף הכניסה: זיהוי משתמש קיים, ברכת שלום ומעבר למשחק.
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const playerNameInput = document.getElementById('playerName');
    const playerPhoneInput = document.getElementById('playerPhone');
    const welcomeMessage = document.getElementById('welcomeMessage');

    /**
     * פונקציה לבדיקת שחקן קיים ועדכון הודעת שלום
     */
    const checkExistingPlayer = () => {
        const name = playerNameInput.value.trim();
        const phone = playerPhoneInput.value.trim();

        // שליפת רשימת השחקנים מהזיכרון
        const data = JSON.parse(localStorage.getItem('highList')) || [];

        // בדיקה האם קיים שחקן עם אותו שם וגם אותו טלפון
        const isExisting = data.some(player => player.name === name && player.phone === phone);

        if (name && phone) {
            if (isExisting) {
                welcomeMessage.textContent = `טוב לראותך שוב, ${name}!`;
                welcomeMessage.style.color = "#2ecc71";  
            } else {
                welcomeMessage.textContent = `שמחים שהצטרפת, ${name}!`;
                welcomeMessage.style.color = "#3498db"; 
            }
        } else {
            welcomeMessage.textContent = "ברוכים הבאים לנחש מי!";
            welcomeMessage.style.color = "black";
        }
    };

    //  מעקב אחר השינויים בשדות הקלט כדי לעדכן את ההודעה בזמן אמת
    playerNameInput.addEventListener('input', checkExistingPlayer);
    playerPhoneInput.addEventListener('input', checkExistingPlayer);

    // טיפול בשליחת הטופס
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = playerNameInput.value.trim();
        const phone = playerPhoneInput.value.trim();
        const difficulty = document.getElementById('difficulty').value;

        // שמירת הפרטים הנוכחיים לשימוש במהלך המשחק
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_phone', phone);
        
        // מעבר לדף המשחק עם הפרטים ב-URL
        window.location.href = `HTML/game.html?name=${encodeURIComponent(name)}&level=${difficulty}`;
    });
    
    // --- כאן יבוא קוד המודל של ההוראות שדיברנו עליו קודם ---
});

/**
 * מנהל את תיבת ההוראות (Modal) בדף הבית.
 * הפונקציה מאזינה לאירועי לחיצה לפתיחה וסגירה של חלון ההוראות
 * על ידי שינוי מאפייני ה-CSS של האלמנט.
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('instructionsModal');
    const openBtn = document.getElementById('openInstructions');
    const closeBtn = document.querySelector('.close-button');

    // פתיחת המודל בלחיצה על הכפתור
    openBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // סגירת המודל בלחיצה על ה-X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // סגירת המודל אם המשתמש לוחץ מחוץ לתיבה הלבנה
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});