
import { persons, questionsType } from './data.js';

let secretPerson;
let currentPersons = [...persons];
let timerInterval;
let questionsAsked = 0;

/**
 * מחכה לטעינת ה-DOM, מחלץ נתונים מה-URL ומפעיל את המשחק.
 */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('name');
    const difficulty = params.get('level');

    const gameTitle = document.getElementById('gameTitle');
    if (playerName && gameTitle) {
        gameTitle.textContent = `בהצלחה, ${playerName}!`;
    }

    setupGame(difficulty);
});

/**
 * מאתחלת את הגדרות המשחק לפי הרמה שנבחרה ומפעילה אותו.
 * @param {string} level - רמת הקושי.
 */
function setupGame(level) {
    localStorage.setItem('user_level', level);
    startTheGame();
}

/**
 * בונה את ממשק המשחק הדינמי ומגרילה דמות סודית.
 */
function startTheGame() {
    currentPersons = [...persons];
    const mainContent = document.getElementById('mainContent');
    
    // ניקוי המסך
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    const gameLayout = document.createElement('div');
    gameLayout.className = 'game-layout';
    mainContent.appendChild(gameLayout);

    const questionsArea = document.createElement('div');
    questionsArea.id = 'questionsArea';
    gameLayout.appendChild(questionsArea);

    const board = renderBoard(currentPersons);
    gameLayout.appendChild(board);

    // הגרלת דמות סודית
    secretPerson = persons[Math.floor(Math.random() * persons.length)];
    console.log("דמות סודית:", secretPerson);
    
    renderQuestions(questionsType, questionsArea);

    // בדיקה אם להפעיל טיימר לפי הרמה שנשמרה
    if (localStorage.getItem('user_level') === 'hard') {
        startTimer();
    }
}

/**
 * מייצרת את אלמנט ה-DOM של לוח המשחק.
 * @param {Array<Object>} data - מערך הדמויות להצגה על הלוח.
 * @returns {HTMLElement} אלמנט ה-div המכיל את כרטיסי הדמויות.
 */
function renderBoard(data) {
    const board = document.createElement('div');
    board.id = 'gameBoard';
    board.style.gap = '10px';

    // לולאה העוברת על כל דמות במערך ומייצרת עבורה כרטיס 
    data.forEach((person) => {
        const card = document.createElement('div');
        card.className = 'character-card';

        const img = document.createElement('img');
        img.src = person.img;
        img.alt = "דמות";
        img.style.width = '100px';

        // הוספת לחיצה לכל תמונה לביצוע ניחוש סופי של הדמות
        img.addEventListener('click', () => {
            guessPerson(person);
        });

        card.appendChild(img);
        board.appendChild(card);
    });

    return board;
}

/**
 * בונה את ממשק השאלות והתשובות בתוך הקונטיינר הנבחר.
 * @param {Array<Object>} questions - מערך אובייקטי השאלות מה-data.
 * @param {HTMLElement} container - האלמנט שבתוכו ירונדרו השאלות.
 */
function renderQuestions(questions, container) {
    // ניקוי הקונטיינר ללא innerHTML
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const categoryRow = document.createElement('div');
    categoryRow.className = 'category-row';
    const optionsRow = document.createElement('div');
    optionsRow.className = 'options-row';

    // לולאה ראשית- עוברת על כל קטגוריית שאלות ומייצרת כפתור קטגוריה
    questions.forEach(q => {
        const catBtn = document.createElement('button');
        catBtn.className = 'cat-btn';
        catBtn.textContent = q.title;

        // הגדרת פעולה בעת לחיצה על קטגוריה: הצגת השאלות הספציפיות לאותה קטגוריה
        catBtn.onclick = () => {
            // הסרת מחלקת 'active' מכל הכפתורים והוספתה לכפתור שנלחץ לצורך עיצוב
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            
            // ניקוי אזור האופציות הקודם לפני הצגת האופציות של הקטגוריה החדשה
            while (optionsRow.firstChild) {
                optionsRow.removeChild(optionsRow.firstChild);
            }

            // לולאה פנימית- מייצרת כפתור לכל ערך אפשרי בקטגוריה שנבחרה
            q.questions.forEach(val => {
                const optBtn = document.createElement('button');
                optBtn.className = 'opt-btn';
                optBtn.textContent = val;
                
                // בעת לחיצה על ערך, מתבצעת בדיקה האם המאפיין קיים בדמות הסודית
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
 * בודקת התאמה בין תשובת השחקן לדמות הסודית ומסננת את המערך בהתאם.
 * @param {string} key - המאפיין שנבדק.
 * @param {string} value - הערך שנבחר.
 */
function checkQuestion(key, value) {
    questionsAsked++;
    const isCorrect = secretPerson[key] === value;

    if (isCorrect) {
        currentPersons = currentPersons.filter(p => p[key] === value);
    } else {
        currentPersons = currentPersons.filter(p => p[key] !== value);
    }

    updateBoard();
}

/**
 * מעדכנת את הלוח הקיים על המסך על ידי החלפתו בלוח חדש ומסונן.
 */
function updateBoard() {
    const oldBoard = document.getElementById('gameBoard');
    if (oldBoard && oldBoard.parentNode) {
        const newBoard = renderBoard(currentPersons);
        oldBoard.parentNode.replaceChild(newBoard, oldBoard);
    }
}

/**
 * בודקת ניחוש סופי של דמות ומציגה את מסך סיום המשחק.
 * @param {Object} clickedPerson - אובייקט הדמות עליה לחץ השחקן כניחוש סופי.
 */
function guessPerson(clickedPerson) {
    const welcomeMsg = document.querySelector('h1#gameTitle') || document.querySelector('h2');
    const main = document.getElementById('mainContent');
    const questionsArea = document.getElementById('questionsArea');
    const gameBoard = document.getElementById('gameBoard');

    clearInterval(timerInterval);

    
    if (questionsArea) questionsArea.remove();
    if (gameBoard) {
        gameBoard.style.pointerEvents = "none";
        gameBoard.style.opacity = "0.5";
    }

    if (clickedPerson.img === secretPerson.img) {
        welcomeMsg.textContent = `ניצחת עם ${questionsAsked} שאלות בלבד!`;
        welcomeMsg.style.color = "green";

        // שליפת הנתונים ששמרנו בדף הכניסה
        const name = localStorage.getItem('user_name') || "שחקן אנונימי";
        const phone = localStorage.getItem('user_phone') || "ללא טלפון";
        
        // שליחת כל שלושת הפרמטרים בסדר הנכון
        saveHighScore(name, phone, questionsAsked);
    }

    else {
        welcomeMsg.textContent = "הפסדת הפעם...";
        welcomeMsg.style.color = "red";
    }

    // יצירת אלמנט חשיפת הדמות
    const revealDiv = document.createElement('div');
    revealDiv.className = 'secret-reveal';
    
    const revealText = document.createElement('p');
    revealText.textContent = "הדמות הסודית הייתה:";
    
    const revealImg = document.createElement('img');
    revealImg.src = secretPerson.img;
    revealImg.style.width = '120px';
    revealImg.style.borderRadius = '12px';
    
    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = "משחק חדש";
    newGameBtn.style.marginTop = '15px';
    // חזרה לדף הבית
    newGameBtn.onclick = () => window.location.href = '../index.html';

    revealDiv.appendChild(revealText);
    revealDiv.appendChild(revealImg);
    revealDiv.appendChild(newGameBtn);
    main.appendChild(revealDiv);

    
}



/**
 * שומרת את התוצאה בטבלת השיאים.
 * @param {string} name - שם השחקן.
 * @param {string} phone - טלפון השחקן.
 * @param {number} score - מספר רמזים.
 */
function saveHighScore(name, phone, score) {
    let leaderboard = JSON.parse(localStorage.getItem('highList')) || [];
    
    // חיפוש שחקן קיים לפי הטלפון 
    const existingPlayerIndex = leaderboard.findIndex(p => p.phone === phone);

    if (existingPlayerIndex !== -1) {
        // השחקן קיים - נעדכן רק אם התוצאה הנוכחית טובה יותר (פחות שאלות)
        if (score < leaderboard[existingPlayerIndex].score) {
            leaderboard[existingPlayerIndex].score = score;
            leaderboard[existingPlayerIndex].date = new Date().toLocaleDateString();
        }
    } else {
        // שחקן חדש - נוסיף אותו למערך
        leaderboard.push({
            name: name,
            phone: phone,
            score: score,
            date: new Date().toLocaleDateString()
        });
    }

    // מיון ושמירה
    leaderboard.sort((a, b) => a.score - b.score);
    localStorage.setItem('highList', JSON.stringify(leaderboard));
}



/**
 * מפעילה טיימר ספירה לאחור ומסיימת את המשחק במקרה של חריגה מהזמן.
 */
function startTimer() {
    let timeLeft = 60;
    const main = document.getElementById('mainContent');
    const timerDisplay = document.createElement('h3');
    timerDisplay.id = "timer";
    timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;
    main.prepend(timerDisplay);

    // הגדרת אינטרוול שרץ בכל שנייה 1000 מילישניות לעדכון השעון
    timerInterval = setInterval(() => {
        timeLeft--; // הפחתת שנייה מהזמן הנותר
        timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;

        // בדיקה האם הזמן נגמר
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // עצירת פעולת הטיימר
            
            // חסימת אזור השאלות
            const questionsArea = document.getElementById('questionsArea');
            if (questionsArea) {
                questionsArea.style.opacity = "0.5";
                questionsArea.style.pointerEvents = "none";
            }
            
            // עדכון ההודעה למשתמש למצב של הזדמנות אחרונה
            const welcomeMsg = document.querySelector('h1#gameTitle') || document.querySelector('h2');
            welcomeMsg.textContent = "נגמר הזמן! נא בחר דמות!...";
            welcomeMsg.style.color = "orange";

            // שינוי עיצוב הטיימר כדי להדגיש שנגמר הזמן
            timerDisplay.textContent = "הזדמנות אחרונה!";
            timerDisplay.style.color = "red";
        }
    }, 1000);
}
