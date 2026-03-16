const tableBody = document.querySelector("#ratingTable tbody");

let data = JSON.parse(localStorage.getItem("data")) || {};

const players = Object.entries(data);

players.sort((a, b) => {
    const totalA = a[1].game1 + a[1].game2 + a[1].game3;
    const totalB = b[1].game1 + b[1].game2 + b[1].game3;
    return totalB - totalA;
});

players.forEach(([name, scores], index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>${scores.game1 || 0}</td>
        <td>${scores.game2 || 0}</td>
        <td>${scores.game3 || 0}</td>
        <td>${scores.lastPlayed || "-"}</td>
    `;

    tableBody.appendChild(row);
});
document.getElementById("backBtn")
    .addEventListener("click", () => {
        window.location.href = "main.html";
    });