let score = 5000;
let time = 120;
let timerInterval;

let correctAnswer = null;
let currentLevel = 1;

const scoreStep = 15;

const levels = {
    1: {answers: 2, penalty: 150, reward: 100},
    2: {answers: 3, penalty: 150, reward: 200},
    3: {answers: 4, penalty: 300, reward: 300},
    4: {answers: 5, penalty: 375, reward: 400},
    5: {answers: 6, penalty: 375, reward: 500},
};

function exitToMainMenu() {
    window.location.href = "../main.html";
}

onload = function () {
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            exitToMainMenu();
        }
    });

    startGame();
}

startGame = function () {

    currentLevel = 1;
    generateTask();
    startTimer();
}

function generateTask() {

    const params = ["U", "I", "R"];

    const target = params[Math.floor(Math.random() * params.length)];

    let U = randomInt(5, 150);
    let R = randomInt(1, 60);

    let I = +(U / R).toFixed(2);

    let questionText = "";

    if (target === "U") {
        correctAnswer = +(I * R).toFixed(2);
        questionText = `Дано: I = ${I}A, R = ${R}Ω. Найдите U \nU = I x R`;
    }

    if (target === "I") {
        correctAnswer = +(U / R).toFixed(2);
        questionText = `Дано: U = ${U}V, R = ${R}Ω. Найдите I \nI = U / R`;
    }

    if (target === "R") {
        correctAnswer = +(U / I).toFixed(2);
        questionText = `Дано: U = ${U}V, I = ${I}A. Найдите R \nR = U / I`;
    }

    document.getElementById("taskText").innerText = questionText;

    generateAnswers();
}

function generateAnswers() {

    const container = document.getElementById("answersContainer");
    container.innerHTML = "";

    let optionsCount = levels[currentLevel].answers;

    let answers = new Set();

    answers.add(correctAnswer);

    for (let i = 0; i < optionsCount - 1; i++) {

        let fake;

        do {
            fake = +(correctAnswer * randomFloat(0.5, 1.5)).toFixed(2);
        }
        while (answers.has(fake));

        answers.add(fake);
    }

    let array = Array.from(answers);

    array.sort(() => Math.random() - 0.5);
    array.forEach(answer => {

        const btn = document.createElement("div");
        btn.classList.add("answer");
        btn.innerText = answer;

        btn.addEventListener("dblclick", () => checkAnswer(answer));

        container.appendChild(btn);
    });
}

function checkAnswer(selected) {

    console.log(currentLevel, 5);


    if (selected === correctAnswer) {

        currentLevel++;
        score += levels[currentLevel].reward;

        if(currentLevel === 5) {
            endGame();
            return;
        }

        refreshStats();
        generateTask();
    } else {

        score -= levels[currentLevel].penalty;
        refreshStats();
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}