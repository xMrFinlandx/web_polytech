let bulbs = [];
let switches = [];
let score = 5000;
let scoreStep = 10;
let time = 120;

let switchButtons = [];
let switchStates = [];
let currentLevel = 1;

let isLevelActive;

levels = {
    1: {bulbsCount: 5, switchesCound: 3, reward: 100},
    2: {bulbsCount: 5, switchesCound: 3, reward: 100},
    3: {bulbsCount: 6, switchesCound: 4, reward: 200},
    4: {bulbsCount: 6, switchesCound: 4, reward: 200},
    5: {bulbsCount: 7, switchesCound: 5, reward: 300},
    6: {bulbsCount: 7, switchesCound: 5, reward: 300},
}

onload = () => {
    startGame();
    startTimer();
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

    isLevelActive = true;
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
        btn.innerText = `Вкл. ${index + 1}`;

        btn.addEventListener("click", () => toggleSwitch(index));

        switchButtons.push(btn);

        container.appendChild(btn);
    });
}

function toggleSwitch(index) {

    if (!isLevelActive)
        return;

    switchStates[index] = !switchStates[index];

    if (switchStates[index])
    {
        switchButtons[index].classList.add("active")
    }
    else
    {
        switchButtons[index].classList.remove("active")
    }

    let affected = switches[index];

    affected.forEach(bulbIndex => {
        bulbs[bulbIndex] = !bulbs[bulbIndex];
    });

    refreshBulbs();
    checkWin();
}

function startTimer() {

    timerInterval = setInterval(() => {

        time--;
        score -= scoreStep;

        refreshStats();

        if (time <= 0) {
            clearInterval(timerInterval);
            endGame();
        }

    }, 1000);
}

function refreshStats()
{
    if (score < 0)
        score = 0;

    document.getElementById("timer").textContent = time;
    document.getElementById("score").textContent = score;
}

function checkWin() {

    let allOn = bulbs.every(state => state === true);

    if (allOn) {

        isLevelActive = false;
        score += levels[currentLevel].reward;
        document.getElementById("score").innerText = score;

        setTimeout(nextLevel, 1000);
    }
}

function nextLevel()
{
    console.log(currentLevel);
    switchButtons = [];
    switchStates = [];

    if (currentLevel < Object.keys(levels).length)
    {
        currentLevel++;
        refreshLevel();
        refreshStats();

        startGame();
    }
    else {
        endGame();
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}