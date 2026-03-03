const nameInput = document.getElementById("playerName");
const gameButtons = document.querySelectorAll(".game-btn");
const ratingBtn = document.getElementById("ratingBtn");

ratingBtn.addEventListener("click", () => {
    window.location.href = "rating.html";
});

gameButtons.forEach(btn => {
    btn.disabled = true;
});

nameInput.addEventListener("input", () => {
    const hasName = nameInput.value.trim() !== "";

    gameButtons.forEach(btn => {
        btn.disabled = !hasName;
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("currentUser");

    if (savedName) {
        nameInput.value = savedName;

        gameButtons.forEach(btn => {
            btn.disabled = false;
        });
    }
});

gameButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const name = nameInput.value.trim();

        if (!name)
            return;

        localStorage.setItem("currentUser", name);
        localStorage.setItem("selectedGame", btn.dataset.game);

        window.location.href = `game${btn.dataset.game}/game.html`;
    });
});