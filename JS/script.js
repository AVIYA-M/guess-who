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
}