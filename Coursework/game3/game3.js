let bulbs = [];
let switches = [];
let bulbCount = 45;
let switchCount = 2;
let score = 0;

onload = () => {
    startGame();
};

function startGame() {

    generateConnections();
    generateSolvableState();

    refreshBulbs();
    refreshSwitches();
}

function generateConnections() {

    switches = [];

    for (let i = 0; i < switchCount; i++) {

        let affected = [];
        let connectionsCount = random(1, bulbCount);

        while (affected.length < connectionsCount) {

            let index = random(0, bulbCount);

            if (!affected.includes(index)) {
                affected.push(index);
            }
        }

        switches.push(affected);
    }
}

function generateSolvableState() {

    bulbs = Array(bulbCount).fill(true);

    let solution = [];

    for (let i = 0; i < switchCount; i++) {
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

        setTimeout(startGame, 3000);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}