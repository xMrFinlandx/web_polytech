const grid = document.getElementById("gameGrid");
const rotationStep = 90;

const maxScore = 5000;
const maxTime = 90;

let selectedComponent = null;

let score;
let time;
let timerInterval;

let currentLevel = 1;
let isLevelActive = true;

const levels = {
    1: {gridSize: 5, lamps: 1, replacePenalty: 250, timerPenalty: 50},
    2: {gridSize: 6, lamps: 2, replacePenalty: 500, timerPenalty: 25},
    3: {gridSize: 6, lamps: 4, replacePenalty: 750, timerPenalty: 10},
}

const componentsList = [
    {type: "straight", image: "gameResources/straight.png"},
    {type: "corner", image: "gameResources/corner.png"},
    {type: "t", image: "gameResources/t.png"},
]

const baseConnections = {
    "straight": ["left", "right"],
    "corner": ["top", "right"],
    "t": ["bottom", "right", "left"],
    "battery": ["left", "right"],
    "lamp_off": ["bottom"],
    "lamp_on": ["bottom"]
};

onload = function () {
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            exitToMainMenu();
        }
    });

    startGame();
}

startGame = function () {

    document.getElementById("level").textContent = currentLevel;
    score = maxScore;
    time = maxTime;

    createGrid()
    startTimer();

    createComponents();
    refreshStats();
}

function createGrid() {

    let gridSize = levels[currentLevel].gridSize;

    grid.innerHTML = "";

    grid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");

        cell.classList.add("cell");
        cell.dataset.index = i;

        cell.addEventListener("click", placeElement);
        grid.appendChild(cell);
    }

    placeSpecialElements();
}

function placeSpecialElements() {

    const cells = document.querySelectorAll(".cell");

    let batteryIndex = Math.floor(Math.random() * cells.length);
    createFixedElement(cells[batteryIndex], "battery", "gameResources/battery.png");

    let lampCount = levels[currentLevel].lamps;
    let placed = 0;

    while (placed < lampCount) {

        let randomIndex = Math.floor(Math.random() * cells.length);

        if (randomIndex === batteryIndex)
            continue;

        if (cells[randomIndex].querySelector(".element"))
            continue;

        createFixedElement(cells[randomIndex], "lamp_off", "gameResources/lamp_off.png");

        placed++;
    }
}

function createFixedElement(cell, type, image) {
    const element = document.createElement("div");
    element.classList.add("element");
    element.style.backgroundImage = `url(${image})`;
    element.dataset.type = type;
    element.dataset.rotation = 0;

    element.addEventListener("wheel", rotatePlacedElement);

    cell.appendChild(element);
}

function selectComponent(e) {

    if (isLevelActive === false)
        return;

    document.querySelectorAll(".component")
        .forEach(c => c.classList.remove("selected"));

    selectedComponent = e.currentTarget.dataset.type;

    e.currentTarget.classList.add("selected");
}

function createComponents() {
    const container = document.getElementById("components");

    componentsList.forEach(comp => {

        const div = document.createElement("div");
        div.classList.add("component");
        div.style.backgroundImage = `url(${comp.image})`;
        div.dataset.type = comp.type;
        div.style.animationDelay = `${Math.random()}s`;

        div.addEventListener("dblclick", selectComponent);

        container.appendChild(div);
    });
}

function placeElement(e) {

    if (isLevelActive === false)
        return;

    if (!selectedComponent)
        return;

    const cell = e.currentTarget;
    let element = cell.querySelector(".element");

    if (element && (element.dataset.type === "battery" || element.dataset.type === "lamp_off"))
        return;

    if (element && element.dataset.type !== selectedComponent.toString()) {
        score -= levels[currentLevel].replacePenalty;
        refreshStats();
    }

    cell.innerHTML = "";

    element = document.createElement("div");
    element.classList.add("element");
    element.style.backgroundImage = `url(gameResources/${selectedComponent}.png)`;

    element.dataset.type = selectedComponent;
    element.dataset.rotation = 0;

    element.addEventListener("wheel", rotatePlacedElement);
    cell.appendChild(element);

    checkCircuit();
}

function rotatePlacedElement(e) {

    if (isLevelActive === false)
        return;

    e.preventDefault();

    const element = e.currentTarget;

    let visualRotation = parseInt(element.dataset.visualRotation || 0);
    let factRotation = parseInt(element.dataset.rotation || 0);

    let step =  e.deltaY > 0 ? rotationStep : -rotationStep;

    visualRotation += step;
    factRotation = (factRotation + step + 360) % 360;

    element.dataset.rotation = factRotation;
    element.dataset.visualRotation = visualRotation;

    element.style.transform = `rotate(${visualRotation}deg)`;

    checkCircuit();
}

function startTimer() {
    timerInterval = setInterval(() => {

        time--;
        score -= levels[currentLevel].timerPenalty;

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

function checkCircuit() {
    const cells = document.querySelectorAll(".cell");
    let gridSize = levels[currentLevel].gridSize;

    let batteryPosition = null;
    let totalLamps = 0;
    let connectedLamps = new Set();

    cells.forEach((cell, index) => {

        let element = cell.querySelector(".element");

        if (element && element.dataset.type === "battery") {
            batteryPosition = {
                row: Math.floor(index / gridSize),
                col: index % gridSize,
            };
        }

        if (element && (element.dataset.type === "lamp_off" || element.dataset.type === "lamp_on")) {
            totalLamps++;
        }
    });

    if (!batteryPosition) {
        alert("Батарея не найдена");
        return;
    }

    let visited = new Set();

    function dfs(row, col) {

        let key = row + "-" + col;

        if (visited.has(key))
            return;

        visited.add(key);

        let element = getElementAt(row, col);

        if (!element)
            return;

        let type = element.dataset.type;
        let rotation = parseInt(element.dataset.rotation);
        let connections = getConnections(type, rotation);

        if (type === "lamp_off" || type === "lamp_on") {
            connectedLamps.add(element);
        }

        connections.forEach((direction) => {

            let newRow = row;
            let newCol = col;
            let opposite;

            if (direction === "top") {
                newRow--;
                opposite = "bottom";
            }
            if (direction === "bottom") {
                newRow++;
                opposite = "top";
            }
            if (direction === "left") {
                newCol--;
                opposite = "right";
            }
            if (direction === "right") {
                newCol++;
                opposite = "left";
            }

            if (newRow >= 0 &&
                newRow < gridSize &&
                newCol >= 0 &&
                newCol < gridSize)
            {
                let neighbour = getElementAt(newRow, newCol);

                if (!neighbour)
                    return;

                let neighbourType = neighbour.dataset.type;
                let neighbourRotation = parseInt(neighbour.dataset.rotation);
                let neighbourConnections = getConnections(neighbourType, neighbourRotation);

                if (neighbourConnections.includes(opposite)) {
                    dfs(newRow, newCol);
                }
            }
        });
    }

    dfs(batteryPosition.row, batteryPosition.col);

    document.querySelectorAll('[data-type^="lamp"]').forEach(lamp => {
        if (connectedLamps.has(lamp)) {
            lamp.style.backgroundImage = `url(gameResources/lamp_on.png)`;
            lamp.dataset.type = "lamp_on";
        } else {
            lamp.style.backgroundImage = `url(gameResources/lamp_off.png)`;
            lamp.dataset.type = "lamp_off";
        }
    });

    if (connectedLamps.size === totalLamps && totalLamps > 0)
    {
        isLevelActive = false;
        highlightCorrect()
        setTimeout(nextLevel, 1000);
    }
}

function nextLevel() {

    if (currentLevel < 3)
    {
        isLevelActive = true;

        currentLevel++;
        document.getElementById("level").textContent = currentLevel;
        createGrid();
    }
    else
    {
        endGame();
    }
}

function getConnections(type, rotation)
{
    let connections = baseConnections[type];

    if (!connections)
        return [];

    let directions = ["top", "right", "bottom", "left"];
    let steps = rotation / 90;

    return connections.map(dir => {
        let index = directions.indexOf(dir);
        let newIndex = (index + steps) % directions.length;
        return directions[newIndex];
    });
}

function getElementAt(row, col)
{
    let gridSize = levels[currentLevel].gridSize;

    let index = row * gridSize + col;
    let cell = document.querySelectorAll(".cell")[index];

    if (!cell)
        return null;

    return cell.querySelector(".element");
}

function highlightCorrect() {
    document.querySelectorAll(".cell").forEach(c => {
        c.classList.add("correct");
    });
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

function exitToMainMenu() {
    window.location.href = "../main.html";
}

