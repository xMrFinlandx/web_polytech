let latinPhrases = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra",
]

let russianPhrases = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам",
]

let availableIndexes = [0, 1, 2, 3];
let clickCounter = 0;

let createButton = document.getElementById("createButton");
let recolorButton = document.getElementById("recolorButton");

createButton.addEventListener("click", () => {

    if (availableIndexes.length === 0) {
        alert("Фразы закончились");
        return;
    }

    let tbody = document.getElementById("tbody");

    let tr = document.createElement("tr");
    let latTd = document.createElement("td");
    let rusTd = document.createElement("td");

    let nextIndex = availableIndexes.pop();

    latTd.textContent = "\"" + latinPhrases[nextIndex] + "\"";
    rusTd.textContent = "\"" + russianPhrases[nextIndex] + "\"";

    if (clickCounter % 2 === 0) {
        tr.classList.add("class1");
    } else {
        tr.classList.add("class2");
    }

    clickCounter++;

    tr.appendChild(latTd);
    tr.appendChild(rusTd);

    tbody.appendChild(tr);
})

recolorButton.addEventListener("click", () => {
    let list= document.querySelectorAll("tbody tr");

    for (let i = 0; i < list.length; i++) {
        if ((i + 1) % 2 === 0)
            list[i].style.fontWeight = "bold";
    }
})

onload = () => {
    let currentIndex = availableIndexes.length;

    while (currentIndex !== 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        let temp = availableIndexes[currentIndex];
        availableIndexes[currentIndex] = availableIndexes[randomIndex];
        availableIndexes[randomIndex] = temp;
    }
}