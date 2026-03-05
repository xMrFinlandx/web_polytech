let bulbs = [];
let switches = [];
let score = 5000;

let currentLevel = 1;

levels = {
    1: {bulbsCount: 5, switchesCound: 3, reward: 100},
    2: {bulbsCount: 6, switchesCound: 4, reward: 200},
    3: {bulbsCount: 7, switchesCound: 5, reward: 300},
}

onload = () => {
    startGame();
};

function refreshLevel()
{
    document.getElementById("level").textContent = `${currentLevel}/${Object.keys(levels).length}`;
}

function startGame() {

    generateConnections();
    generateSolvableState();

    refreshLevel();

    refreshBulbs();
    refreshSwitches();
}

function generateConnections() {

    switches = [];

    for (let i = 0; i < levels[currentLevel].switchesCound; i++) {

        let affected = [];
        let connectionsCount = random(1, levels[currentLevel].bulbsCount);

        while (affected.length < connectionsCount) {

            let index = random(0, levels[currentLevel].bulbsCount);

            if (!affected.includes(index)) {
                affected.push(index);
            }
        }

        switches.push(affected);
    }
}

function generateSolvableState() {

    bulbs = Array(levels[currentLevel].bulbsCount).fill(true);

    let solution = [];

    for (let i = 0; i < levels[currentLevel].switchesCound; i++) {
        solution.push(Math.random() > 0.5);
    }

    solution.forEach((pressed, switchIndex) => {
        if (pressed) {
            switches[switchIndex].forEach(bulbIndex => {
                bulbs[bulbIndex] = !bulbs[bulbIndex];
            });
        }
    });
}

function refreshBulbs() {

    const container = document.getElementById("bulbsContainer");
    container.innerHTML = "";

    bulbs.forEach((state, index) => {

        const bulb = document.createElement("div");
        bulb.classList.add("bulb");

        if (state)
            bulb.classList.add("on");

        container.appendChild(bulb);
    });
}

function refreshSwitches() {

    const container = document.getElementById("switchesContainer");
    container.innerHTML = "";

    switches.forEach((connections, index) => {

        const btn = document.createElement("button");
        btn.classList.add("switch-btn");
        btn.innerText = `Переключатель ${index + 1}`;

        btn.addEventListener("click", () => toggleSwitch(index));

        container.appendChild(btn);
    });
}

function toggleSwitch(index) {

    let affected = switches[index];

    affected.forEach(bulbIndex => {
        bulbs[bulbIndex] = !bulbs[bulbIndex];
    });

    refreshBulbs();
    checkWin();
}

function checkWin() {

    let allOn = bulbs.every(state => state === true);

    if (allOn) {

        score += 50;
        document.getElementById("score").innerText = score;

        console.log("Включены все лампы");

        nextLevel();
    }
}

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

function nextLevel()
{
    console.log(currentLevel);

    if (currentLevel < Object.keys(levels).length)
    {
        currentLevel++;
        refreshLevel();

        startGame();
    }
    else {
        endGame();
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}