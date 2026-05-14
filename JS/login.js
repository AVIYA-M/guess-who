

/**
 * ניהול דף הכניסה (Login) - אחראי על אימות נתונים, הוראות המשחק והעברת המשתמש למשחק
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const modal = document.getElementById("instructionsModal");
    const btn = document.getElementById("openInstructions");
    const span = document.querySelector(".close-button");

    const nameInput = document.getElementById('playerName');
    const phoneInput = document.getElementById('playerPhone');


    const highScoreBtn = document.getElementById('highScoreBtn');
    if (highScoreBtn) {
        highScoreBtn.addEventListener('click', () => {
            // מעבר דף באמצעות BOM 
            window.location.href = 'HTML/highList.html';
        });
    }

    phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    //  ניהול הוראות 
    if (btn && modal) {
        btn.onclick = () => modal.style.display = "block";
    }
    if (span) {
        span.onclick = () => modal.style.display = "none";
    }
    window.onclick = (e) => { 
        if (e.target == modal) modal.style.display = "none"; 
    };

    //  שליחת טופס 
    if (loginForm) {
        /**
        * מטפל באירוע שליחת הטופס: מנקה רווחים, מבצע בדיקת תקינות ועובר לדף המשחק.
        * @param {Event} e - אובייקט האירוע של השליחה.
        */
        loginForm.addEventListener('submit', (e) => {
            //מונע רענון אוטומטי
            e.preventDefault();
            
            const finalName = nameInput.value.trim();
            const finalPhone = phoneInput.value.trim();
            const difficulty = document.getElementById('difficulty').value;

            //בדיקה אם השדות ריקים - טיפול בשגיאות
            if (!finalName || !finalPhone) {
                console.warn("נא למלא שדות ריקים"); 
                return; // עוצר את הפונקציה ומונע את המעבר לדף הבא
            }



            // שמירה ב-localStorage לצורך שימוש בדפים אחרים
            localStorage.setItem('user_name', finalName);
            localStorage.setItem('user_phone', finalPhone);
            
            // מעבר לדף המשחק
            window.location.href = `HTML/start.html?name=${encodeURIComponent(finalName)}&level=${difficulty}`;
        });
    }
});