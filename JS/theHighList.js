/**
 * JS/theHighList.js
 * מנהל את הצגת טבלת השיאים השמורה ב-localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('highListContainer');
    const backBtn = document.getElementById('backToHome');

    //  כפתור חזרה למסך הבית
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // שליפת הנתונים מה-localStorage 
    const data = JSON.parse(localStorage.getItem('highList')) || [];

    // ניקוי הקונטיינר לפני הצגה
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (data.length === 0) {
        const p = document.createElement('p');
        p.textContent = "עדיין אין שיאים. תהיו הראשונים!";
        container.appendChild(p);
    } else {
        const table = document.createElement('table');
        table.className = "highList-table";

        // 1. יצירת שורת כותרת
        const headerRow = document.createElement('tr');
        const headers = ["שם שחקן", "טלפון", "מספר רמזים", "תאריך"];
        
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // 2. מילוי הנתונים בעזרת map (הצגת 5 התוצאות הטובות ביותר)
        data.slice(0, 5).map(player => {
            const tr = document.createElement('tr');

            // עמודת שם
            const tdName = document.createElement('td');
            tdName.textContent = player.name;

            // עמודת טלפו
            const tdPhone = document.createElement('td');
            tdPhone.textContent = player.phone || "---";

            // עמודת ציון (מספר רמזים)
            const tdScore = document.createElement('td');
            tdScore.textContent = player.score;

            // עמודת תאריך
            const tdDate = document.createElement('td');
            tdDate.textContent = player.date;

            // הוספת כל התאים לשורה
            tr.appendChild(tdName);
            tr.appendChild(tdPhone);
            tr.appendChild(tdScore);
            tr.appendChild(tdDate);
            
            // הוספת השורה לטבלה
            table.appendChild(tr);
        });

        // השמת הטבלה המוכנה לקונטיינר בדף
        container.appendChild(table);
    }
});