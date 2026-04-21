
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
    clearInterval(timerInterval); // עוצר את הטיימר אם הוא עוד רץ
    const questionsArea = document.getElementById('questionsArea');
    const gameBoard = document.getElementById('gameBoard');
    const isWin = clickedPerson.img === secretPerson.img;

    // 1. חסימת לוח המשחק (שלא יוכלו להמשיך לנחש)
    gameBoard.style.pointerEvents = "none";
    gameBoard.style.opacity = "0.4";

    // 2. שחרור חסימות מה-questionsArea (למקרה שנגמר הזמן קודם)
    questionsArea.style.opacity = "1";
    questionsArea.style.pointerEvents = "auto"; 

    // 3. הזרקת תוכן הסיום
    questionsArea.innerHTML = `
        <div class="secret-reveal-side">
            <h2 style="color: ${isWin ? '#fdcb6e' : '#ff4757'}">
                ${isWin ? 'כל הכבוד, צדקת!' : 'אופס, טעית...'}
            </h2>
            <p>הדמות הסודית הייתה:</p>
            <img src="${secretPerson.img}" alt="secret">
            
            <hr style="opacity: 0.2; margin: 15px 0;">
            
            <button class="icon-btn" onclick="window.location.href='../index.html'">
                <img src="../IMAGES/again.png" alt="חדש">
            </button>
        </div>
    `;

    if (isWin) {
        saveHighScore(localStorage.getItem('user_name'), localStorage.getItem('user_phone'), questionsAsked);
    }
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

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // במקום לחסום את כל הדיב, נחסום רק את היכולת ללחוץ על שאלות
            const questionsArea = document.getElementById('questionsArea');
            if (questionsArea) {
                // אנחנו רק מחלישים את הנראות, אבל לא נועלים את הדיב עצמו
                questionsArea.style.opacity = "0.8"; 
                // חסימת לחיצות רק על כפתורי השאלות שנמצאים בפנים
                const buttons = questionsArea.querySelectorAll('button');
                buttons.forEach(btn => btn.style.pointerEvents = "none");
            }
            
            const welcomeMsg = document.getElementById('gameTitle') || document.querySelector('h2');
            welcomeMsg.textContent = "נגמר הזמן! נא בחר דמות!";
            welcomeMsg.style.color = "orange";

            timerDisplay.textContent = "הזדמנות אחרונה!";
            timerDisplay.style.color = "red";
        }
    }, 1000);
}