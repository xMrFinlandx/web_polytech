let areaWidth = 600;
let areaHeight = 360;
let tolerancePx = 15;
let toleranceDeg = 10;

onload = () => {
    let pieces = document.querySelectorAll(".piece");
    let referencePiece = pieces[0];

    pieces.forEach(piece => {
        randomizePositionAndRotation(piece);
        initDrag(piece, referencePiece);
        initRotation(piece);
    });
};

function randomizePositionAndRotation(piece)
{
    let pieceWidth = piece.getBoundingClientRect().width;
    let pieceHeight = piece.getBoundingClientRect().height;

    let randomX = Math.random() * (areaWidth - pieceWidth);
    let randomY = Math.random() * (areaHeight - pieceHeight);

    piece.style.left = randomX + "px";
    piece.style.top = randomY + "px";

    let isRotationAllowed = parseInt(piece.dataset.allowRotation) === 1;
    let randomRotation = 0;

    if (isRotationAllowed)
        randomRotation = Math.floor(Math.random() * 24) * 15;

    piece.style.transform = `rotate(${randomRotation}deg)`;
    piece.dataset.rotation = randomRotation;

    piece.ondragstart = () => false;
}

function initDrag(piece, referencePiece)
{
    piece.addEventListener("mousedown", (e) => {

        e.preventDefault();

        let shiftX = e.clientX - piece.getBoundingClientRect().left;
        let shiftY = e.clientY - piece.getBoundingClientRect().top;

        piece.style.cursor = "grabbing";

        function moveAt(e) {
            let puzzleRect = piece.parentElement.getBoundingClientRect();
            let newLeft = e.pageX - puzzleRect.left - shiftX;
            let newTop = e.pageY - puzzleRect.top - shiftY;

            newLeft = Math.max(0, Math.min(puzzleRect.width - piece.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(puzzleRect.height - piece.offsetHeight, newTop));

            piece.style.left = newLeft + 'px';
            piece.style.top = newTop + 'px';
        }

        function onMouseUp()
        {
            document.removeEventListener("mousemove", moveAt);
            document.removeEventListener("mouseup", onMouseUp);

            piece.style.cursor = "grab";

            chekAndSnap(piece, referencePiece);
        }

        document.addEventListener("mousemove", moveAt);
        document.addEventListener("mouseup", onMouseUp);
    });
}

function initRotation(piece)
{
    piece.addEventListener("wheel", (e) => {

        e.preventDefault();

        let isRotationAllowed = parseInt(piece.dataset.allowRotation) === 1;

        if (e.buttons !== 1 || !isRotationAllowed)
            return;

        let rotation = parseInt(piece.dataset.rotation) || 0;

        if (e.deltaY < 0)
            rotation += 15;
        else
            rotation -= 15;

        piece.style.transform = `rotate(${rotation}deg)`;
        piece.dataset.rotation = rotation;
    })
}

function chekAndSnap(piece, referencePiece)
{
    let refX = parseInt(referencePiece.style.left);
    let refY = parseInt(referencePiece.style.top);

    let correctX = refX + parseInt(piece.dataset.correctX);
    let correctY = refY + parseInt(piece.dataset.correctY);
    let correctRotation = parseInt(piece.dataset.correctRotation);

    let currentX = parseInt(piece.style.left);
    let currentY = parseInt(piece.style.top);
    let currentRotation = parseInt(piece.dataset.rotation) % 360;

    if (Math.abs(currentX - correctX) <= tolerancePx &&
        Math.abs(currentY - correctY) <= tolerancePx &&
        Math.abs(currentRotation - correctRotation) <= toleranceDeg)
    {
        piece.style.left = correctX + "px";
        piece.style.top = correctY + "px";
        piece.dataset.rotation = correctRotation;
        piece.style.transform = `rotate(${correctRotation}deg)`;

        piece.dataset.fixed = "true";
        checkPuzzleComplete(piece.parentElement);
    }
}

function checkPuzzleComplete(puzzleArea)
{
    let pieces = puzzleArea.querySelectorAll(".piece");
    let isAllFixed = Array.from(pieces).every(p => p.dataset.fixed === "true");

    if (!isAllFixed)
        return;

    puzzleArea.classList.add("completed");
}
