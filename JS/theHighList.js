/**
 * JS/theHighList.js
 * מנהל את הצגת טבלת השיאים השמורה ב-localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('highListContainer');
    const backBtn = document.getElementById('backToHome');

    // לכפתור חזרה 
    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // שליפת הנתונים והפיכתם חזרה למערך אובייקטים (JSON Parse)
    const data = JSON.parse(localStorage.getItem('highList')) || [];

    if (data.length === 0) {
        const p = document.createElement('p');
        p.textContent = "עדיין אין שיאים. תהיו הראשונים!";
        container.appendChild(p);
    } else {
        const table = document.createElement('table');
        table.className = "highList-table";

        // יצירת שורת כותרת
        const headerRow = document.createElement('tr');
        const headers = ["שם שחקן", "מספר רמזים", "תאריך"];
        
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // מילוי הנתונים - שימוש ב-map
        data.slice(0, 5).map(player => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = player.name;

            const tdScore = document.createElement('td');
            tdScore.textContent = player.score;

            const tdDate = document.createElement('td');
            tdDate.textContent = player.date;

            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            tr.appendChild(tdDate);
            
            table.appendChild(tr);
        });

        container.appendChild(table);
    }
});