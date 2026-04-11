import { persons, questionsType } from './data.js';

let secretPerson;
let currentPersons = [...persons];

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

    // יוצרים כותרת חדשה עם שם השחקן
    const welcome = document.createElement('h2');
    const playerName = localStorage.getItem('user_name');
    welcome.textContent = "בהצלחה, " + playerName + "!";
    mainContent.appendChild(welcome);

    console.log("הטופס הוסר, מתחילים לבנות את הלוח...");
    const startBoard = renderBoard(currentPersons);
    mainContent.appendChild(startBoard);
    
    //בחירת דמות רנדומלית מהמערך
    const randomm = Math.floor(Math.random() * persons.length);
    secretPerson = persons[randomm];
    
    
    console.log("הדמות הסודית שנבחרה היא: ", secretPerson.Min, secretPerson.hairColor);
    
    renderQuestions(questionsType);
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
function renderQuestions(questions) {
    const mainContent = document.getElementById('mainContent');
    
    const quesContainer = document.createElement('div');
    quesContainer.id = 'questionsArea';
    quesContainer.style.margin = '20px 0';

    // יצירת תיבת בחירה לקטגוריות (מין, צבע שיער וכו')
    const typeSelect = document.createElement('select');
    typeSelect.id = 'typeSelect';

    questions.forEach(q => {
        const option = document.createElement('option');
        option.value = q.key;
        option.textContent = q.title;
        typeSelect.appendChild(option);
    });

    //יצירת תיבת בחירה לערכים (איש/אישה, שחור/חום...)
    const valueSelect = document.createElement('select');
    valueSelect.id = 'valueSelect';

    // פונקציה לעדכון הערכים בתיבה השנייה לפי מה שנבחר בראשונה
    const updateValues = () => {
        valueSelect.innerHTML = ""; 
        const selectedKey = typeSelect.value;
        const selectedCategory = questions.find(q => q.key === selectedKey);
        
        selectedCategory.questions.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            valueSelect.appendChild(option);
        });
    };

    // בודק שינוי בתיבה הראשונה כדי לעדכן את השנייה
    typeSelect.addEventListener('change', updateValues);
    updateValues(); // הפעלה ראשונית

    //כפתור "שאל שאלה"
    const askBtn = document.createElement('button');
    askBtn.textContent = "שאל שאלה";
    askBtn.addEventListener('click', () => {
        checkQuestion(typeSelect.value, valueSelect.value);
    });

    quesContainer.appendChild(typeSelect);
    quesContainer.appendChild(valueSelect);
    quesContainer.appendChild(askBtn);
    
    mainContent.appendChild(quesContainer);
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
    const mainContent = document.getElementById('mainContent');
    const oldBoard = document.getElementById('gameBoard');
    
    // יוצרים לוח חדש מסונן
    const newBoard = renderBoard(currentPersons);
    
    // מחליפים את הישן בחדש
    mainContent.replaceChild(newBoard, oldBoard);
}

/**
 * בודקת האם הדמות שנלחצה היא הדמות הסודית
 * @param {Object} clickedPerson - האובייקט של הדמות עליה לחצו
 */
function guessPerson(clickedPerson) {
    const welcomeMsg = document.querySelector('h2');
    
    if (clickedPerson.Min === secretPerson.Min) {
        welcomeMsg.textContent = "ניצחת את המשחק!";
        welcomeMsg.style.color = "green";
    } else {
        welcomeMsg.textContent = "לא נכון, נסה שוב...";
        welcomeMsg.style.color = "red";
    }
}