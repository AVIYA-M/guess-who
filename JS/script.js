import { persons, questionsType } from './data.js';

let secretPerson;
let currentPersons = [...persons];
let timerInterval;

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
    currentPersons = [...persons];
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ""; 

    const welcome = document.createElement('h2');
    welcome.style.color = "white";
    welcome.textContent = `בהצלחה, ${localStorage.getItem('user_name')}!`;
    mainContent.appendChild(welcome);

    // יצירת הקונטיינר המפוצל
    const gameLayout = document.createElement('div');
    gameLayout.className = 'game-layout';
    mainContent.appendChild(gameLayout);

    // אזור שאלות 
    const questionsArea = document.createElement('div');
    questionsArea.id = 'questionsArea';
    gameLayout.appendChild(questionsArea);

    // לוח המשחק
    const board = renderBoard(currentPersons);
    gameLayout.appendChild(board);

    // הגרלת דמות
    secretPerson = persons[Math.floor(Math.random() * persons.length)];
    console.log("דמות סודית:", secretPerson);

    // רנדור שאלות לתוך 
    renderQuestions(questionsType, questionsArea);

    if (localStorage.getItem('user_level') === 'hard') startTimer();
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

        // הוספת אירוע לחיצה לכל דמות
        img.addEventListener('click', () => {
            guessPerson(person);
        });

        
        // הוספת התמונה לקופסה וכן הוספת  הקופסה ללוח
        card.appendChild(img);
        board.appendChild(card);
    });

    return board;
}

/**
 * מייצרת את השאלות עבור השחקן
 * @param {Array} questions - מערך סוגי השאלות 
 */
// עדכון פונקציית הרינדור של השאלות
function renderQuestions(questions, container) {
    container.innerHTML = ""; // ניקוי
    
    const categoryRow = document.createElement('div');
    categoryRow.className = 'category-row';
    const optionsRow = document.createElement('div');
    optionsRow.className = 'options-row';

    questions.forEach(q => {
        const catBtn = document.createElement('button');
        catBtn.className = 'cat-btn';
        catBtn.textContent = q.title;
        catBtn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            optionsRow.innerHTML = "";
            q.questions.forEach(val => {
                const optBtn = document.createElement('button');
                optBtn.className = 'opt-btn';
                optBtn.textContent = val;
                optBtn.onclick = () => checkQuestion(q.key, val);
                optionsRow.appendChild(optBtn);
            });
        };
        categoryRow.appendChild(catBtn);
    });

    container.appendChild(categoryRow);
    container.appendChild(optionsRow);
}

/**
 * פונקציה שבודקת אם התשובה נכונה
 * @param {string} key - הקטגוריה 
 * @param {string} value - הערך
 */
function checkQuestion(key, value) {
    const isCorrect = secretPerson[key] === value;

    if (isCorrect) {
        console.log("כן");
        //  משאירים רק את מי שהמאפיין שלו זהה לערך שנבחר
        currentPersons = currentPersons.filter(p => p[key] === value);
    } 
    else {
        console.log("לא");
        //  משאירים רק את מי שהמאפיין שלו שונה מהערך שנבחר
        currentPersons = currentPersons.filter(p => p[key] !== value);
    }

    // עדכון הלוח על המסך
    updateBoard();
}

function updateBoard() {
    const oldBoard = document.getElementById('gameBoard');
    const parent = oldBoard.parentNode; 
    const newBoard = renderBoard(currentPersons);
    parent.replaceChild(newBoard, oldBoard);
}

/**
 * בודקת האם הדמות שנלחצה היא הדמות הסודית
 * @param {Object} clickedPerson - האובייקט של הדמות עליה לחצו
 */
function guessPerson(clickedPerson) {
    const welcomeMsg = document.querySelector('h2');
    const main = document.getElementById('mainContent');
    const questionsArea = document.getElementById('questionsArea');
    const gameBoard = document.getElementById('gameBoard');

    clearInterval(timerInterval);

    // 1. ביטול אפשרות לחיצה על הלוח והשאלות
    if (questionsArea) questionsArea.remove();
    gameBoard.style.pointerEvents = "none";
    gameBoard.style.opacity = "0.5";

    // בדיקת תוצאה וחשיפת הדמות
    if (clickedPerson.img === secretPerson.img) {
        welcomeMsg.textContent = "ניצחת כל הכבוד!";
        welcomeMsg.style.color = "var(--success)";
    } else {
        welcomeMsg.textContent = "הפסדת הפעם...";
        welcomeMsg.style.color = "var(--danger)";
    }

    // הצגת הדמות הסודית בסיום
    const revealDiv = document.createElement('div');
    revealDiv.className = 'secret-reveal';
    revealDiv.innerHTML = `
        <p>הדמות הסודית הייתה:</p>
        <img src="${secretPerson.img}" style="width:120px; border-radius:12px;">
        <button onclick="location.reload()" style="margin-top:15px; background:var(--primary); color:white; padding:12px 24px; border-radius:12px; border:none; cursor:pointer;">משחק חדש</button>
    `;
    main.prepend(revealDiv);}

/**
 * מפעילה טיימר של 60 שניות. אם הזמן נגמר - המשחק מסתיים.
 */
function startTimer() {
    let timeLeft = 60;
    const timerDisplay = document.createElement('h3');
    timerDisplay.id = "timer";
    timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;
    document.getElementById('mainContent').prepend(timerDisplay);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('mainContent').innerHTML = "<h2>נגמר הזמן! הפסדת...</h2>";
            // הוספת כפתור "נסה שוב"
            const retryBtn = document.createElement('button');
            retryBtn.textContent = "נסה שוב";
            retryBtn.onclick = () => location.reload();
            document.getElementById('mainContent').appendChild(retryBtn);
        }
    }, 1000);
}