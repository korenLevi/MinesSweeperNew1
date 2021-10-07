'use strict';

var gBoard = [];



const MINE = '💣';
const EMPTY_CELL = '';
const CELL = ''
const FLAG = '🚩'
const HINT = '💡'
const HINT_IMG = ''
var gMines = [];
var gIsClicked = false;
var livesLeft = 3;
var gTimer;
var gLevelStr = 'beginner'
var gIsHintClicked = false;
var gHintsCount = 3;
var gItsSafeClick = false;
var gSafeClick = 3;



var gCellObject = {
    isShown: false,
    cellShown: CELL,
    cellContain: EMPTY_CELL,
    numberOfMines: 0
};


var elHint = document.querySelector('.hints');
elHint.innerHTML = HINT;

var gHints = 3;
var gLevel = {
    SIZE: 4,
    MINES: 2,
    DIFFFICULTY: 1
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var elEmoji = document.querySelector('.emoji');
elEmoji.innerHTML = '😃';


// setInterval(setTime, 1000);


// time()
// <label class="clock" id="minutes">00</label><a id="dot">:</a><label id="seconds">00</label>
// function time() {
//     var timer;
//     var ele = document.getElementById('timer');
//     (function () {
//         var sec = 0;
//         timer = setInterval(() => {
//             ele.innerHTML = '00:' + sec;
//             sec++;
//         }, 1000)
//     })()

// }

// function clearTimer() {
//     clearInterval(gTimer);
// }



var gidx = 0;

function changeLevel(elLevel) {
    restartGame()
    if (elLevel.id === 'beginner' && !gIsClicked) {


        if (gLevel.DIFFFICULTY === 1) return;
        if (gLevel.DIFFFICULTY === 2) {
            var el = document.querySelector('.medium-table')

            el.classList.remove('medium-table');
            el.classList.add('beginner-table')
        } else if (gLevel.DIFFFICULTY === 3) {
            var el = document.querySelector('.expert-table')

            el.classList.remove('expert-table');
            el.classList.add('beginner-table')
        }
        gLevelStr = 'beginner';
        gLevel.DIFFFICULTY = 1;
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        init();
    }
    if (elLevel.id === 'medium' && !gIsClicked) {
        if (gLevel.DIFFFICULTY === 2) return;
        if (gLevel.DIFFFICULTY === 1) {
            var el = document.querySelector('.beginner-table')

            el.classList.remove('beginner-table');
            el.classList.add('medium-table')
        } else if (gLevel.DIFFFICULTY === 3) {
            var el = document.querySelector('.expert-table')

            el.classList.remove('expert-table');
            el.classList.add('medium-table')
        }
        gLevelStr = 'medium';
        gLevel.DIFFFICULTY = 2;
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        init();
    }
    if (elLevel.id === 'expert' && !gIsClicked) {

        if (gLevel.DIFFFICULTY === 3) return;
        if (gLevel.DIFFFICULTY === 1) {
            var el = document.querySelector('.beginner-table')

            el.classList.remove('beginner-table');
            el.classList.add('expert-table')
        } else if (gLevel.DIFFFICULTY === 2) {
            var el = document.querySelector('.medium-table')

            el.classList.remove('medium-table');
            el.classList.add('expert-table')
        }
        gLevelStr = 'expert';
        gLevel.DIFFFICULTY = 3;
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        init();
    }
}



function safeClick(elSafeClick) {
    if (gSafeClick === 0) return;
    var location = getRandomCellLocation();
    gItsSafeClick = !gItsSafeClick;
    var elCell = document.getElementById('cell-' + location.i + '-' + location.j);
    var backgroundColor = '#dcd6bc';
    elCell.style.backgroundColor = '#0af30a7c';
    gSafeClick--;
    elSafeClick.innerHTML = elSafeClick.innerHTML.slice(0, -1);
    elSafeClick.innerHTML = elSafeClick.innerHTML.concat(gSafeClick);
    setTimeout(function () {
        elCell.style.backgroundColor = backgroundColor;
        console.log(elCell.style.backgroundColor);
    }, 2000)
}

function init() {
    gGame.isOn = true;
    gBoard = createBoard();
    renderBoard(gBoard);
}


function createBoard() {
    var board = [];

    for (var i = 0; i < gLevel.SIZE; i++) {

        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var gCell = {

                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = gCell;
        }
    }

    return board;
}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < gLevel.SIZE; i++) {

        strHTML += '<tr>';

        for (var j = 0; j < gLevel.SIZE; j++) {
            var className = 'cell';
            var cellM = '';
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" class="${className}"
             onclick="cellClicked(this, ${i} , ${j})" oncontextmenu="flagClicked(this, ${i} , ${j})">${cellM}</td>`
        }
        strHTML += '</tr>';
    }
    if (gLevel.DIFFFICULTY === 1) {
        var elBoard = document.querySelector('.beginner-table');
        elBoard.innerHTML = strHTML;
    } else if (gLevel.DIFFFICULTY === 2) {
        var elBoard = document.querySelector('.medium-table');
        elBoard.innerHTML = strHTML;
    } else if (gLevel.DIFFFICULTY === 3) {
        var elBoard = document.querySelector('.expert-table');
        elBoard.innerHTML = strHTML;
    }



}


function checkVictory() {
    var winStatus = false;

    var sum = ((gLevel.SIZE * gLevel.SIZE) - gMines.length)
    if (gGame.shownCount === sum) {
        winStatus = true;
        for (var i = 0; i < gMines.length; i++) {
            var minesLocation = gMines[i];
            if (!gBoard[minesLocation.i][minesLocation.j].isMarked) {
                winStatus = false;
                break;
            }
        }
        if (winStatus) {
            var elLives = document.querySelector('.lives');
            elLives.innerHTML = 'You Win !'
            gGame.isOn = false;

        }
    }
    if (winStatus) {
        var elEmoji = document.querySelector('.emoji');
        elEmoji.innerHTML = '😎';
    }

}



function mineClicked() {

    for (var i = 0; i < gMines.length; i++) {
        var minesLocation = gMines[i];
        var elMine = document.getElementById('cell-' + minesLocation.i + '-' + minesLocation.j);
        elMine.classList.remove('cell');
        elMine.classList.add('mine-' + gLevelStr);
        elMine.innerHTML = MINE;
        var elLives = document.querySelector('.lives');
        elLives.innerHTML = 'You Loose !'
        gGame.isOn = false;
        var elEmoji = document.querySelector('.emoji');
        elEmoji.innerHTML = '😓';
    }

}

function flagClicked(elCell, i, j) {


    if (!gGame.isOn) {

        return;
    }
    if (elCell.classList.contains('checked')) return;
    if (!elCell.classList.contains('flag')) {
        elCell.classList.add('flag');
        elCell.innerHTML = FLAG;
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        checkVictory()
    } else {
        elCell.classList.remove('flag');
        elCell.innerHTML = '';
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
    }
}

function hintClicked(elHint) {

    if (gIsHintClicked) {
        elHint.style.removeProperty('filter');
        gIsHintClicked = !gIsHintClicked;
    } else {
        gIsHintClicked = !gIsHintClicked;
        elHint.style.filter = 'contrast() sepia(1) saturate(10) brightness(.99) hue-rotate(0deg)';
    }


    if (gHintsCount === 0) {
        elHint.innerHTML = ''
    }
}

function cellClicked(elCell, i, j) {
    var board = gBoard;
    checkVictory();
    if (gIsHintClicked) {
        gHintsCount--;
        hintRevels(board, elCell, i, j);
        setTimeout(function () {
            unRevelCellHint();
            var elHints = document.getElementById('hints');
            elHint.innerHTML = HINT;
            gIsHintClicked = false;
            elHints.style.removeProperty('filter');
        }, 1000)
        return;
    }
    if (board[i][j].isMarked) return;
    if (!gGame.isOn) return;
    if (!gIsClicked) {
        gMines = setMines(i, j);
        setMinesNegsCount(gBoard)
        gIsClicked = true;
        console.log(gBoard);
    }
    var isMine = board[i][j].isMine;
    var totalMinesAround = gBoard[i][j].minesAroundCount;
    if (totalMinesAround === 0 && !isMine) {
        expandShown(board, elCell, i, j);
        return;
    }
    var cell = board[i][j]

    if (cell.isMine) {

        if (livesLeft === 1) {
            board[i][j].isShown = true;
            mineClicked();
            gGame.isOn = false;



        } else {
            livesLeft--;
            var elEmoji = document.querySelector('.emoji');
            elEmoji.innerHTML = '😫';
            setTimeout(function () {
                var elEmoji = document.querySelector('.emoji');
                elEmoji.innerHTML = '😃';
            }, 750)

            var elLives = document.querySelector('.lives');
            elLives.innerHTML = elLives.innerHTML.slice(0, -1);
            elLives.innerHTML = elLives.innerHTML.concat(livesLeft);

        }
        return;
    }

    if (elCell.classList.contains('cell')) {
        elCell.classList.remove('cell');
    }
    var total = board[i][j].minesAroundCount;
    if (total != 0) {
        board[i][j].isShown = true;
        gGame.shownCount++;
        elCell.classList.add('checked')
        if (total == 1) elCell.classList.add('one')
        if (total == 2) elCell.classList.add('two')
        if (total == 3) elCell.classList.add('three')
        if (total == 4) elCell.classList.add('four')
        if (total == 5) elCell.classList.add('four')
        if (total == 6) elCell.classList.add('four')
        if (total == 7) elCell.classList.add('four')
        if (total == 8) elCell.classList.add('four')
        elCell.innerHTML = total

        checkVictory();
        return
    }





}



function mines(idxI, idxJ) {
    var minesIdx = []
    var mine;
    for (var i = 0; i < gLevel.MINES; i++) {


        mine = getRandomMineLocation();
        if (minesIdx.indexOf(mine) === -1) {
            mine = getRandomMineLocation();
        }
        minesIdx[i] = mine;


        while (idxI === minesIdx[i].i && idxJ === minesIdx[i].j) {
            minesIdx[i] = getRandomMineLocation();
        }


    }

    return minesIdx;
}

function setMines(idxI, idxJ) {
    var minesLocations = mines(idxI, idxJ);
    var board = gBoard;
    for (var i = 0; i < minesLocations.length; i++) {
        board[minesLocations[i].i][minesLocations[i].j].isMine = true;
    }
    return minesLocations;
}


function getRandomMineLocation() {
    var location = {
        i: getRandomIntInt(0, gLevel.SIZE),
        j: getRandomIntInt(0, gLevel.SIZE)
    };
    return location;
}

function getRandomCellLocation() {
    var location = {
        i: getRandomIntInt(0, gLevel.SIZE),
        j: getRandomIntInt(0, gLevel.SIZE)
    };
    console.log(location);
    if (gBoard[location.i][location.j].isMine ||
        gBoard[location.i][location.j].isShown) return getRandomCellLocation();
    // console.log(location);
    return location;
}




function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}










function restartGame() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.getElementById('cell-' + i + '-' + j)
            if (elCell.classList.contains('checked')) {
                elCell.classList.remove('checked')
            }
            if (elCell.classList.contains('mine')) {
                elCell.classList.remove('mine')
            }
            if (elCell.classList.contains('flag')) {
                elCell.classList.remove('flag')
            }
            if (elCell.classList.contains('cell')) {
                elCell.classList.remove('cell')
            }
            if (elCell.classList.contains('one')) {
                elCell.classList.remove('one')
            }
            if (elCell.classList.contains('two')) {
                elCell.classList.remove('two')
            }
            if (elCell.classList.contains('three')) {
                elCell.classList.remove('three')
            }
            if (elCell.classList.contains('four')) {
                elCell.classList.remove('four')
            }
            gBoard[i][j].isMine = false;
            gBoard[i][j].isMarked = false;
            gBoard[i][j].minesAroundCount = 0;


        }
    }
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gGame.isOn = false;
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerHTML = '😀';
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = 'Lives : 3'
    gIsClicked = false;

    livesLeft = 3;
    init();
}


function setMinesNegsCount(gBoard) {

    for (var i = 0; i < gBoard.length; i++) {
        var board = gBoard[i];
        var totalMines = 0;
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.getElementById('cell-' + i + '-' + j);
            if (!gBoard[i][j].isMine) {


                //left ccorner , right corner , first line
                if (i === 0 && j === 0) { // u l corner

                    if (gBoard[i + 1][j].isMine) totalMines++;
                    if (gBoard[i][j + 1].isMine) totalMines++;
                    if (gBoard[i + 1][j + 1].isMine) totalMines++;
                } else if (i === 0 && j === gBoard.length - 1) { // u r corner 
                    if (gBoard[i + 1][j].isMine) totalMines++;
                    if (gBoard[i][j - 1].isMine) totalMines++;
                    if (gBoard[i + 1][j - 1].isMine) totalMines++;
                } else if (i === 0) {
                    if (gBoard[i + 1][j].isMine) totalMines++;
                    if (gBoard[i][j + 1].isMine) totalMines++;
                    if (gBoard[i + 1][j + 1].isMine) totalMines++;
                    if (gBoard[i][j - 1].isMine) totalMines++;
                    if (gBoard[i + 1][j - 1].isMine) totalMines++;
                }

                //

                if (i === gBoard.length - 1 && j === 0) { // d l corner

                    if (gBoard[i - 1][j].isMine) totalMines++;
                    if (gBoard[i][j + 1].isMine) totalMines++;
                    if (gBoard[i - 1][j + 1].isMine) totalMines++;
                } else if (i === gBoard.length - 1 && j === gBoard.length - 1) { // d r corner
                    if (gBoard[i - 1][j].isMine) totalMines++;
                    if (gBoard[i][j - 1].isMine) totalMines++;
                    if (gBoard[i - 1][j - 1].isMine) totalMines++;
                } else if (i === gBoard.length - 1) {
                    if (gBoard[i - 1][j].isMine) totalMines++;
                    if (gBoard[i][j + 1].isMine) totalMines++;
                    if (gBoard[i - 1][j + 1].isMine) totalMines++;
                    if (gBoard[i][j - 1].isMine) totalMines++;
                    if (gBoard[i - 1][j - 1].isMine) totalMines++;
                } else if ((0 < i && i < gBoard.length - 1) && j === 0) {
                    if (gBoard[i - 1][j].isMine) totalMines++; // UP
                    if (gBoard[i - 1][j + 1].isMine) totalMines++; // UP right corner
                    if (gBoard[i][j + 1].isMine) totalMines++; // RIGHT
                    if (gBoard[i + 1][j + 1].isMine) totalMines++; // DOWN RIGHT CORNER
                    if (gBoard[i + 1][j].isMine) totalMines++; //DOWN
                } else if (((0 < i) && (i < gBoard.length)) && (0 < j) && (j === gBoard.length - 1)) {
                    if (gBoard[i - 1][j - 1].isMine) totalMines++; //LEFT UP CORNER
                    if (gBoard[i - 1][j].isMine) totalMines++; // UP
                    if (gBoard[i + 1][j].isMine) totalMines++; //DOWN
                    if (gBoard[i + 1][j - 1].isMine) totalMines++; //DOWN LEFT CORNERS
                    if (gBoard[i][j - 1].isMine) totalMines++; //LEFT
                } else if (((0 < i) && (i < gBoard.length - 1)) && ((0 < j) && (j < gBoard.length - 1))) {

                    if (gBoard[i - 1][j - 1].isMine) totalMines++; //LEFT UP CORNER
                    if (gBoard[i - 1][j].isMine) totalMines++; // UP
                    if (gBoard[i - 1][j + 1].isMine) totalMines++; // UP right corner
                    if (gBoard[i][j + 1].isMine) totalMines++; // RIGHT
                    if (gBoard[i + 1][j + 1].isMine) totalMines++; // DOWN RIGHT CORNER
                    if (gBoard[i + 1][j].isMine) totalMines++; //DOWN
                    if (gBoard[i + 1][j - 1].isMine) totalMines++; //DOWN LEFT CORNERS
                    if (gBoard[i][j - 1].isMine) totalMines++; //LEFT
                }

                gBoard[i][j].minesAroundCount = totalMines;
            }
            totalMines = 0;
        }
    }


}

function revelCell(i, j) {


    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) return;
    var elCell = document.getElementById('cell-' + i + '-' + j);
    if (elCell.classList.contains('cell')) {
        elCell.classList.remove('cell');
    }
    var total = gBoard[i][j].minesAroundCount;
    gBoard[i][j].isShown = true;
    if (total != 0) {
        elCell.classList.add('checked')
        if (total == 1) elCell.classList.add('one')
        if (total == 2) elCell.classList.add('two')
        if (total == 3) elCell.classList.add('three')
        if (total == 4) elCell.classList.add('four')
        elCell.innerHTML = total
        gGame.shownCount++;
        return
    } else {
        elCell.classList.add('checked')
        gGame.shownCount++;
    }



}


function expandShown(board, elCell, i, j) {


    if (!board[i][j].isMine && board[i][j].minesAroundCount === 0) {
        revelCell(i, j);


        //left ccorner , right corner , first line
        if (i === 0 && j === 0) { // u l corner

            if (!board[i + 1][j].isMine) revelCell(i + 1, j);
            if (!board[i][j + 1].isMine) revelCell(i, j + 1);
            if (!board[i + 1][j + 1].isMine) revelCell(i + 1, j + 1);
        } else if (i === 0 && j === board.length - 1) { // u r corner 
            if (!board[i + 1][j].isMine) revelCell(i + 1, j);
            if (!board[i][j - 1].isMine) revelCell(i, j - 1);
            if (!board[i + 1][j - 1].isMine) revelCell(i + 1, j - 1);
        } else if (i === 0) {
            if (!board[i + 1][j].isMine) revelCell(i + 1, j);
            if (!board[i][j + 1].isMine) revelCell(i, j + 1);
            if (!board[i + 1][j + 1].isMine) revelCell(i + 1, j + 1);
            if (!board[i][j - 1].isMine) revelCell(i, j - 1);
            if (!board[i + 1][j - 1].isMine) revelCell(i + 1, j - 1);
        }

        //
        else if (i === board.length - 1 && j === 0) { // d l corner

            if (!board[i - 1][j].isMine) revelCell(i - 1, j);
            if (!board[i][j + 1].isMine) revelCell(i, j + 1);
            if (!board[i - 1][j + 1].isMine) revelCell(i - 1, j + 1);
        } else if (i === board.length - 1 && j === board.length - 1) { // d r corner
            if (!board[i - 1][j].isMine) revelCell(i - 1, j);
            if (!board[i][j - 1].isMine) revelCell(i, j - 1);
            if (!board[i - 1][j - 1].isMine) revelCell(i - 1, j - 1);
        } else if (i === board.length - 1 && ((0 < j) && (j < board.length - 1))) {
            if (!board[i - 1][j].isMine) revelCell(i - 1, j);
            if (!board[i][j + 1].isMine) revelCell(i, j + 1);
            if (!board[i - 1][j + 1].isMine) revelCell(i - 1, j + 1);
            if (!board[i][j - 1].isMine) revelCell(i, j - 1);
            if (!board[i - 1][j - 1].isMine) revelCell(i - 1, j - 1);
        } else if ((0 < i && i < board.length - 1) && j === 0) {
            if (!board[i - 1][j].isMine) revelCell(i - 1, j); // UP
            if (!board[i - 1][j + 1].isMine) revelCell(i - 1, j + 1); // UP right corner
            if (!board[i][j + 1].isMine) revelCell(i, j + 1); // RIGHT
            if (!board[i + 1][j + 1].isMine) revelCell(i + 1, j + 1); // DOWN RIGHT CORNER
            if (!board[i + 1][j].isMine) revelCell(i + 1, j); //DOWN
        } else if (((0 < i) && (i < board.length)) && (0 < j) && (j === board.length - 1)) {
            if (!board[i - 1][j - 1].isMine) revelCell(i - 1, j - 1); //LEFT UP CORNER
            if (!board[i - 1][j].isMine) revelCell(i - 1, j); // UP
            if (!board[i + 1][j].isMine) revelCell(i + 1, j); //DOWN
            if (!board[i + 1][j - 1].isMine) revelCell(i + 1, j - 1); //DOWN LEFT CORNERS
            if (!board[i][j - 1].isMine) revelCell(i, j - 1); //LEFT
        } else if (((0 < i) && (i < board.length - 1)) && ((0 < j) && (j < board.length - 1))) {

            if (!board[i - 1][j - 1].isMine) revelCell(i - 1, j - 1); //LEFT UP CORNER
            if (!board[i - 1][j].isMine) revelCell(i - 1, j); // UP
            if (!board[i - 1][j + 1].isMine) revelCell(i - 1, j + 1); // UP right corner
            if (!board[i][j + 1].isMine) revelCell(i, j + 1); // RIGHT
            if (!board[i + 1][j + 1].isMine) revelCell(i + 1, j + 1); // DOWN RIGHT CORNER
            if (!board[i + 1][j].isMine) revelCell(i + 1, j); //DOWN
            if (!board[i + 1][j - 1].isMine) revelCell(i + 1, j - 1); //DOWN LEFT CORNERS
            if (!board[i][j - 1].isMine) revelCell(i, j - 1); //LEFT
        } else if (j === board.length - 1) {
            if (!board[i - 1][j].isMine) revelCell(i - 1, j); // UP
            if (!board[i - 1][j - 1].isMine) revelCell(i - 1, j - 1); //LEFT UP CORNER
            if (!board[i][j - 1].isMine) revelCell(i, j - 1); //LEFT
            if (!board[i + 1][j].isMine) revelCell(i + 1, j); //DOWN
            if (!board[i + 1][j - 1].isMine) revelCell(i + 1, j - 1); //DOWN LEFT CORNERS
        }
    }

    if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        checkVictory();
    }
}


var gHintsLocation = [];

function revelCellHint(i, j) {
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) return;
    var hintsLocation = {
        i: i,
        j: j,
        class: ''
    };
    gHintsLocation.push(hintsLocation);

    var elCell = document.getElementById('cell-' + i + '-' + j);

    if (elCell.classList.contains('cell')) {
        elCell.classList.remove('cell');
    }
    var total = gBoard[i][j].minesAroundCount;
    // gBoard[i][j].isShown = true;
    if (total != 0) {
        elCell.classList.add('checked')
        if (total == 1) elCell.classList.add('one'), hintsLocation.class = 'one';
        else if (total == 2) elCell.classList.add('two'), hintsLocation.class = 'two';
        else if (total == 3) elCell.classList.add('three'), hintsLocation.class = 'three';
        else if (total == 4) elCell.classList.add('four'), hintsLocation.class = 'four';
        elCell.innerHTML = total
        return
    } else {
        elCell.classList.add('checked')
    }



}

function unRevelCellHint() {

    for (var i = 0; i < gHintsLocation.length; i++) {
        var hLocation = gHintsLocation[i];

        var elCell = document.getElementById('cell-' + hLocation.i + '-' + hLocation.j);
        elCell.classList.remove('checked');
        if (elCell.classList.contains(hLocation.class)) {
            elCell.classList.remove(hLocation.class);
            elCell.innerHTML = '';
        }
        elCell.classList.add('cell');
    }
    gHintsLocation = [];
}


function hintRevels(board, elCell, i, j) {



    revelCellHint(i, j);


    //left ccorner , right corner , first line
    if (i === 0 && j === 0) { // u l corner

        revelCellHint(i + 1, j);
        revelCellHint(i, j + 1);
        revelCellHint(i + 1, j + 1);
    } else if (i === 0 && j === board.length - 1) { // u r corner 
        revelCellHint(i + 1, j);
        revelCellHint(i, j - 1);
        revelCellHint(i + 1, j - 1);
    } else if (i === 0) {
        revelCellHint(i + 1, j);
        revelCellHint(i, j + 1);
        revelCellHint(i + 1, j + 1);
        revelCellHint(i, j - 1);
        revelCellHint(i + 1, j - 1);
    }

    //
    else if (i === board.length - 1 && j === 0) { // d l corner

        revelCellHint(i - 1, j);
        revelCellHint(i, j + 1);
        revelCellHint(i - 1, j + 1);
    } else if (i === board.length - 1 && j === board.length - 1) { // d r corner
        revelCellHint(i - 1, j);
        revelCellHint(i, j - 1);
        revelCellHint(i - 1, j - 1);
    } else if (i === board.length - 1 && ((0 < j) && (j < board.length - 1))) {
        revelCellHint(i - 1, j);
        revelCellHint(i, j + 1);
        revelCellHint(i - 1, j + 1);
        revelCellHint(i, j - 1);
        revelCellHint(i - 1, j - 1);
    } else if ((0 < i && i < board.length - 1) && j === 0) {
        revelCellHint(i - 1, j); // UP
        revelCellHint(i - 1, j + 1); // UP right corner
        revelCellHint(i, j + 1); // RIGHT
        revelCellHint(i + 1, j + 1); // DOWN RIGHT CORNER
        revelCellHint(i + 1, j); //DOWN
    } else if (((0 < i) && (i < board.length)) && (0 < j) && (j === board.length - 1)) {
        revelCellHint(i - 1, j - 1); //LEFT UP CORNER
        revelCellHint(i - 1, j); // UP
        revelCellHint(i + 1, j); //DOWN
        revelCellHint(i + 1, j - 1); //DOWN LEFT CORNERS
        revelCellHint(i, j - 1); //LEFT
    } else if (((0 < i) && (i < board.length - 1)) && ((0 < j) && (j < board.length - 1))) {

        revelCellHint(i - 1, j - 1); //LEFT UP CORNER
        revelCellHint(i - 1, j); // UP
        revelCellHint(i - 1, j + 1); // UP right corner
        revelCellHint(i, j + 1); // RIGHT
        revelCellHint(i + 1, j + 1); // DOWN RIGHT CORNER
        revelCellHint(i + 1, j); //DOWN
        revelCellHint(i + 1, j - 1); //DOWN LEFT CORNERS
        revelCellHint(i, j - 1); //LEFT
    } else if (j === board.length - 1) {
        revelCellHint(i - 1, j); // UP
        revelCellHint(i - 1, j - 1); //LEFT UP CORNER
        revelCellHint(i, j - 1); //LEFT
        revelCellHint(i + 1, j); //DOWN
        revelCellHint(i + 1, j - 1); //DOWN LEFT CORNERS
    }


    if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        checkVictory();
    }
}