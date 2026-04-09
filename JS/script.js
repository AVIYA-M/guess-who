import { persons, questionsType } from './data.js';

let secretPerson;

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
 * פונקציה המנהלת את תהליך תחילת המשחק:
 * 1. מנקה את המסך מהטופס.
 * 2. מציגה הודעת ברכה אישית.
 * 3. מייצרת את לוח המשחק.
 * 4. מגרילה את הדמות הסודית שהשחקן צריך לנחש.
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
    
    //בחירת דמות רנדומלית מהמערך
    const randomm = Math.floor(Math.random() * persons.length);
    secretPerson = persons[randomm];
    
    // הדפסה לבדיקה שלנו (שהשחקן לא יראה בטעות)
    console.log("הדמות הסודית שנבחרה היא: ", secretPerson.Min, secretPerson.hairColor);

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