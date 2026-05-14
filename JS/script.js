import { persons, questionsType } from './data.js';

// משתנים גלובליים לניהול מצב המשחק
let secretPerson;
let currentPersons = [...persons];
let timerInterval;
let questionsAsked = 0;

// הגדרת צלילים
const backgroundMusic = new Audio("../IMAGES/musicBackground.mp3"); 
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;



/**
 * מחכה לטעינת ה-DOM, מחלץ נתונים מה-URL ומפעיל את המשחק.
 */
document.addEventListener('DOMContentLoaded', () => {

      document.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(err => console.log("Music play blocked:", err));
        }
      }, { once: true });

    const backHomeBtn = document.getElementById('backHome');
    
    if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    }
    // שימוש ב-BOM כדי לחלץ פרמטרים מכתובת ה-URL
    const params = new URLSearchParams(window.location.search);
    
    // שליפת שם השחקן והרמה (עדיפות ל-URL, גיבוי ב-SessionStorage)
    let playerName = params.get('name') || sessionStorage.getItem('playerName');
    let difficulty = params.get('level') || sessionStorage.getItem('user_level');

    // שמירה בזיכרון לשימוש עתידי במקרה של משחק חוזר
    if (playerName) sessionStorage.setItem('playerName', playerName);
    if (difficulty) sessionStorage.setItem('user_level', difficulty);

    const gameTitle = document.getElementById('gameTitle');
    if (playerName && gameTitle) {
        // שימוש ב-textContent (בטוח יותר מ-innerHTML) לעדכון הכותרת
        gameTitle.textContent = `בהצלחה ${playerName}!`;
        gameTitle.style.textAlign = "center";
        gameTitle.style.webkitTextStroke = "1px var(--bg-dark)";
    }

    // הפעלת אתחול המשחק
    setupGame(difficulty);
});

/**
 * מאתחלת את הגדרות המשחק לפי הרמה שנבחרה ומפעילה אותו.
 */
function setupGame(level) {
    // שמירת רמת הקושי ב-localStorage לשימוש בפונקציות אחרות
    localStorage.setItem('user_level', level);
    startTheGame();
}

/**
 * בונה את ממשק המשחק הדינמי ומגרילה דמות סודית.
 */
function startTheGame() {
    currentPersons = [...persons];
    const mainContent = document.getElementById('mainContent');
    
    // ניקוי המסך בעזרת לולאה 
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    // יצירה דינמית של אלמנט ה-Layout המרכזי
    const gameLayout = document.createElement('div');
    gameLayout.className = 'game-layout';
    mainContent.appendChild(gameLayout);

    // יצירת אזור השאלות
    const questionsArea = document.createElement('div');
    questionsArea.id = 'questionsArea';
    gameLayout.appendChild(questionsArea);

    // רינדור לוח המשחק (הקלפים)
    const board = renderBoard(currentPersons);
    gameLayout.appendChild(board);

    // הגרלת דמות סודית מתוך המערך בעזרת Math.random
    secretPerson = persons[Math.floor(Math.random() * persons.length)];
    console.log("דמות סודית:", secretPerson);
    
    // בניית כפתורי השאלות לפי קטגוריות
    renderQuestions(questionsType, questionsArea);

    // הפעלת טיימר רק אם רמת הקושי היא 'hard'
    if (localStorage.getItem('user_level') === 'hard') {
        startTimer();
    }
}

/**
 * מייצרת את אלמנט ה-DOM של לוח המשחק.
 */
function renderBoard(data) {
    const board = document.createElement('div');
    board.id = 'gameBoard';
    board.style.gap = '10px';

    // לולאה העוברת על כל דמות ומייצרת עבורה כרטיס (DOM דינמי)
    data.forEach((person) => {
        const card = document.createElement('div');
        card.className = 'character-card';

        const img = document.createElement('img');
        img.src = person.img;
        img.alt = "דמות";
        img.style.width = '100px';

        // הוספת אירוע קליק לכל תמונה לביצוע ניחוש סופי
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
 */
function renderQuestions(questions, container) {
    // ניקוי הקונטיינר
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const categoryRow = document.createElement('div');
    categoryRow.className = 'category-row';
    const optionsRow = document.createElement('div');
    optionsRow.className = 'options-row';

    // מעבר על כל קטגוריה ליצירת כפתורי תפריט
    questions.forEach(q => {
        const catBtn = document.createElement('button');
        catBtn.className = 'cat-btn';
        catBtn.textContent = q.title;

        // הגדרת אירוע לחיצה על קטגוריה להצגת האופציות שלה
        catBtn.onclick = () => {
            // הסרת מצב 'active' מכל הכפתורים והוספה לכפתור שנלחץ
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            
            // ניקוי אופציות קודמות
            while (optionsRow.firstChild) {
                optionsRow.removeChild(optionsRow.firstChild);
            }

            // יצירת כפתור לכל ערך בקטגוריה הנבחרת
            q.questions.forEach(val => {
                const optBtn = document.createElement('button');
                optBtn.className = 'opt-btn';
                optBtn.textContent = val;
                
                // בדיקת השאלה מול הדמות הסודית בעת לחיצה
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
 * בודקת התאמה ומסמנת דמויות לא מתאימות כשקופות.
 */
function checkQuestion(key, value) {
    questionsAsked++; // מעקב אחר מספר השאלות לטובת הניקוד
    const isCorrect = secretPerson[key] === value;

    // שליפת כל הקלפים הקיימים לביצוע עדכון ויזואלי
    const allCards = document.querySelectorAll('.character-card');

    persons.forEach((person, index) => {
        const card = allCards[index];
        if (!card) return;

        // לוגיקה לבדיקת התאמה: אם התשובה "כן", נפסול את מי שאין לו. אם "לא", נפסול את מי שיש לו.
        const matchesCurrentHint = isCorrect ? (person[key] === value) : (person[key] !== value);

        // שינוי מאפייני CSS דרך ה-JS לפסילת דמויות
        if (!matchesCurrentHint) {

            card.style.opacity = "0.3";       // שקיפות

            card.style.transform = "rotate(5deg) scale(0.95)"; // הטיה

            card.style.pointerEvents = "none"; // חסימת לחיצה

            card.style.filter = "grayscale(80%)"; // בונוס: הופך אותן לקצת אפורות
    }
    });
}
window.addEventListener('beforeunload', () => {
    backgroundMusic.pause();
});
/**
 * פונקציה מעודכנת  - בודקת ניחוש ומציגה מסך סיום.
 */
function guessPerson(clickedPerson) {
    // עצירת הטיימר ב-BOM
    backgroundMusic.pause(); // עוצר את המוזיקה
    clearInterval(timerInterval);
    const questionsArea = document.getElementById('questionsArea');
    const gameBoard = document.getElementById('gameBoard');
    
    // בדיקה האם התמונה שלחצו עליה היא התמונה הסודית
    const isWin = clickedPerson.img === secretPerson.img;

    // חסימת לוח המשחק למניעת ניחושים נוספים
    gameBoard.style.pointerEvents = "none";
    gameBoard.style.opacity = "0.4";

    // ניקוי אזור השאלות לצורך הצגת תוצאה 
    while (questionsArea.firstChild) {
        questionsArea.removeChild(questionsArea.firstChild);
    }

    // יצירה דינמית של מסך הסיום 
    const revealDiv = document.createElement('div');
    revealDiv.className = 'secret-reveal-side';

    revealDiv.style.display = "flex";
    revealDiv.style.flexDirection = "column";
    revealDiv.style.alignItems = "center";
    revealDiv.style.justifyContent = "center";
    revealDiv.style.textAlign = "center";
    revealDiv.style.width = "100%";

    const resultTitle = document.createElement('h2');
    resultTitle.textContent = isWin ? 'כל הכבוד, צדקת!' : 'אופס, טעית...';
    resultTitle.style.color = isWin ? '#fdcb6e' : '#ff4757';

    const revealText = document.createElement('p');
    revealText.textContent = 'הדמות הסודית הייתה:';

    const secretImg = document.createElement('img');
    secretImg.src = secretPerson.img;
    
    // כפתור למשחק חוזר
    const retryBtn = document.createElement('button');
    retryBtn.className = 'icon-btn';
    retryBtn.onclick = () => window.location.href='../HTML/start.html';
    
    const btnImg = document.createElement('img');
    btnImg.src = "../IMAGES/again.png";
    retryBtn.appendChild(btnImg);

    // חיבור האלמנטים לפי הסדר
    revealDiv.appendChild(resultTitle);
    revealDiv.appendChild(revealText);
    revealDiv.appendChild(secretImg);
    revealDiv.appendChild(retryBtn);
    questionsArea.appendChild(revealDiv);

    // שמירת שיא רק במקרה של ניצחון
    if (isWin) {
        saveHighScore(localStorage.getItem('user_name'), localStorage.getItem('user_phone'), questionsAsked);
    }
}

/**
 * שומרת את התוצאה ב-localStorage עם שימוש ב-HOF (findIndex, sort).
 */
function saveHighScore(name, phone, score) {
    // שליפה והמרה של מחרוזת JSON מה-storage למערך אובייקטים
    let leaderboard = JSON.parse(localStorage.getItem('highList')) || [];
    
    // שימוש ב-findIndex למציאת שחקן קיים 
    const existingPlayerIndex = leaderboard.findIndex(p => p.phone === phone);

    if (existingPlayerIndex !== -1) {
        // עדכון תוצאה רק אם היא טובה יותר מהקודמת
        if (score < leaderboard[existingPlayerIndex].score) {
            leaderboard[existingPlayerIndex].score = score;
            leaderboard[existingPlayerIndex].date = new Date().toLocaleDateString();
        }
    } 
    else {
        // הוספת שחקן חדש למערך
        leaderboard.push({ name, phone, score, date: new Date().toLocaleDateString() });
    }

    // מיון המערך לפי הניקוד 
    leaderboard.sort((a, b) => a.score - b.score);
    // שמירה חזרה ב-storage כמחרוזת
    localStorage.setItem('highList', JSON.stringify(leaderboard));
}

/**
 * מפעילה טיימר ספירה לאחור בעזרת setInterval.
 */
function startTimer() {
    let timeLeft = 60;
    const main = document.getElementById('mainContent');
    const timerDisplay = document.createElement('h3');
    timerDisplay.id = "timer";
    timerDisplay.style.color="#ffeb3b";
    timerDisplay.style.margin="5px";

    timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;
    main.prepend(timerDisplay);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `זמן נותר: ${timeLeft} שניות`;

        // טיפול במקרה שנגמר הזמן
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            backgroundMusic.pause();
            const questionsArea = document.getElementById('questionsArea');
            if (questionsArea) {
                questionsArea.style.opacity = "0.8"; 
                // חסימת כל הכפתורים באזור השאלות
                questionsArea.querySelectorAll('button').forEach(btn => btn.style.pointerEvents = "none");
            }
            
            const welcomeMsg = document.getElementById('gameTitle');
            if (welcomeMsg) {
                welcomeMsg.textContent = "נגמר הזמן! נא בחר דמות!";
                welcomeMsg.style.color = "#ffeb3b";
            }
        }
    }, 1000);
}