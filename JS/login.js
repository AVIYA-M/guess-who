
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const modal = document.getElementById("instructionsModal");
    const btn = document.getElementById("openInstructions");
    const span = document.querySelector(".close-button");

    if (btn && modal) {
        btn.onclick = () => modal.style.display = "block";
    }
    if (span) {
        span.onclick = () => modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('playerName').value;
            const phone = document.getElementById('playerPhone').value;
            const difficulty = document.getElementById('difficulty').value;

            localStorage.setItem('user_name', name);
            localStorage.setItem('user_phone', phone);
            window.location.href = `HTML/game.html?name=${encodeURIComponent(name)}&level=${difficulty}`;
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('playerPhone');
    const nameInput = document.getElementById('playerName');
    const welcomeMsg = document.getElementById('welcomeMessage');

    function updateWelcomeMessage() {
        const phone = phoneInput.value;
        const leaderboard = JSON.parse(localStorage.getItem('highList')) || [];
        
        // החיפוש נעשה לפי טלפון בלבד
        const existingPlayer = leaderboard.find(p => p.phone === phone);

        if (existingPlayer) {
            welcomeMsg.textContent = `טוב לראותך שוב, ${nameInput.value}!`;
            welcomeMsg.style.color = "#fdcb6e";
            // אם הטלפון זוהה, נשלים את השם אוטומטית (אופציונלי)
            if (!nameInput.value) nameInput.value = existingPlayer.name;
        } else if (nameInput.value.length < 1) {
            welcomeMsg.textContent = `שמחים שהצטרפת, ${nameInput.value}!`;
            welcomeMsg.style.color = "white";
        } else {
            welcomeMsg.textContent = "נחש מי!";
            welcomeMsg.style.color = "white";
        }
    }

    phoneInput.addEventListener('input', updateWelcomeMessage);
    nameInput.addEventListener('input', updateWelcomeMessage);
    
});