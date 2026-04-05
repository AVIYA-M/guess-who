import { persons, questionsType } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('loginForm');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // עוצר את הדף מלהתרענן

            // שומרים את מה שהמשתמש כתב ובחר
            const name = document.getElementById('playerName').value;
            const level = document.getElementById('difficulty').value;

            localStorage.setItem('user_name', name);
            localStorage.setItem('user_level', level);

            console.log("השם שנשמר: " + name);
            console.log("הרמה שנבחרה: " + level);

            // קריאה לפונקציה שתתחיל את המשחק
            startTheGame();
        });
    }
});

/**
 * פונקציה שמתחילה את המשחק בפועל
 * מעלימה את הטופס ומכינה את לוח המשחק
 */
function startTheGame() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = ""; 

    // יוצרים כותרת חדשה עם שם השחקן
    const welcome = document.createElement('h2');
    const playerName = localStorage.getItem('user_name');
    welcome.textContent = "בהצלחה, " + playerName + "!";
    mainContent.appendChild(welcome);

    console.log("הטופס הוסר, מתחילים לבנות את הלוח...");
    renderBoard(persons);
}
/**
 * פונקציה שמייצרת את לוח המשחק על המסך
 * @param {Array} data - מערך הדמויות להצגה
 */
function renderBoard(data) {
    const mainContent = document.getElementById('mainContent');
    
    // יצירת (Container) לכל הדמויות
    const board = document.createElement('div');
    board.id = 'gameBoard';
    board.style.display = 'grid'; 
    board.style.gridTemplateColumns = 'repeat(4, 1fr)';
    board.style.gap = '10px';

    // לולאה שעוברת על כל דמות במערך
    data.forEach((person) => {
        // יצירת קופסה לכל דמות
        const card = document.createElement('div');
        card.className = 'character-card';

        // יצירת התמונה
        const img = document.createElement('img');
        img.src = person.img;
        img.alt = "דמות";
        img.style.width = '100px';

        // הוספת התמונה לקופסה וכן הוספת  הקופסה ללוח
        card.appendChild(img);
        board.appendChild(card);
    });

    mainContent.appendChild(board);
}