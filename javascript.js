// 0 = cella vuota
// 1 = barra

const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stackBtn');
const ScoreCounter = document.querySelector('.score-value');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

const gridMatrix=[
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0,0,0]
];

let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let t;
let velocitaIniziale = 1000;
let velocita = velocitaIniziale

function draw(){
    grid.innerHTML='';

    gridMatrix.forEach(function(rowContent, rowIndex){
        rowContent.forEach(function(cellContent,CellIndex){
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const isRowEven = rowIndex % 2 === 0;
            const isCellEven  = CellIndex % 2 === 0;

            if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
                cell.classList.add('cell-dark');
            }

            if (cellContent === 1){
                cell.classList.remove('cell-dark')
                cell.classList.add('bar');
            }
            grid.appendChild(cell);
        });
    });
}

function moveRight() {
    const row = gridMatrix[currentRowIndex];
    row.unshift(0);
    row.pop();
}

function moveLeft() {
    const row = gridMatrix[currentRowIndex];
    row.push(0);
    row.shift();
}

function isRightEdge() {
    const row = gridMatrix[currentRowIndex];
    const lastElement = row[row.length - 1];
    return lastElement === 1;
}

function isLeftEdge() {
    const row = gridMatrix[currentRowIndex];
    const firstElement = row[0];
    return firstElement === 1;
}

function moveBar() {
    const currentRow = gridMatrix[currentRowIndex];
    if (barDirection === 'right') {
        moveRight();
        if (isRightEdge()) {
            barDirection = 'left'; // Cambia a 'left' se sei al bordo destro
        }
    } else if (barDirection === 'left') {
        moveLeft();
        if (isLeftEdge()) {
            barDirection = 'right';
        }
    }

}


function checkLost () {
    const currentRow = gridMatrix[currentRowIndex];
    const prevRow = gridMatrix[currentRowIndex + 1];

    if (!prevRow) return;

    for(let i= 0; i<currentRow.length; i++){
        if (currentRow[i] === 1 && prevRow[i] === 0){
            currentRow[i] = 0;
            barSize--;
        }

        if (barSize===0){
            isGameOver = true;
            clearInterval(t);
            ScoreCounter.innerText = '00000';
            endGame(false);

        }
    }
}

function checkWin(){
    if (currentRowIndex === 0){
        isGameOver = true;
        clearInterval(t);
        endGame(true);

    }
};

function updateScore(){
    const finalBlock = document.querySelectorAll('.bar');
    ScoreCounter.innerText = finalBlock.length.toString().padStart(5,'0');
};

function onStack(){
    //controllo  lost
    checkLost();

    //controllo win
    checkWin();

    //update Score
    updateScore();

    if(isGameOver) return;
    //cambio riga
    currentRowIndex --;
  
    barDirection = 'right';
    for (let i = 0; i < barSize; i++){
        gridMatrix[currentRowIndex][i] = 1;
    }

    if (velocita > 300) {
        velocita -= 100; // Puoi regolare la diminuzione di velocità desiderata
    }


    clearInterval(t);
    t = setInterval(main, velocita);


    draw();

};

window.addEventListener('keydown', function(event) {
    if (event.key === ' ' || event.key === 'Spacebar') { // Rileva la barra spaziatrice
        event.preventDefault(); // Evita il comportamento predefinito (scorrimento della pagina)
        onStack(); // Chiama la funzione onStack()
    }
});


function endGame(isVictory) {
    endGameScreen.classList.remove('hidden');
    if (isVictory === true) {
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'YOU WIN';
    }
}

function resetGame() {
    location.reload();
}

draw();

function main (){
    //udate
    moveBar();
    //disegno
    draw();
};



stackBtn.addEventListener('click', onStack);
playAgainButton.addEventListener('click', function () {
    resetGame();
});



t=setInterval(main, 1000);