function exitToMainMenu() {
    window.location.href = "../main.html";
}

window.addEventListener("keydown", (event) => {

    if (event.code === "Escape") {
        event.preventDefault();
        exitToMainMenu();
    }

    else if (event.code === "KeyE") {
        event.preventDefault();
        nextLevel();
    }

});

function endGame() {

    const name = localStorage.getItem("currentUser");
    const selectedGame = localStorage.getItem("selectedGame");

    let data = JSON.parse(localStorage.getItem("data")) || {};

    if (!data[name]) {
        data[name] = {
            game1: 0,
            game2: 0,
            game3: 0,
            lastPlayed: ""
        };
    }

    data[name][`game${selectedGame}`] =
        Math.max(data[name][`game${selectedGame}`], score);

    data[name].lastPlayed = new Date().toLocaleDateString();
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "../rating.html";
}