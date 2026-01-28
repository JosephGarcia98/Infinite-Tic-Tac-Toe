import { currBoard, xAge, oAge, MAX_ACTIVE_PIECES, WINNING_COMBO, gameActive } from './gamestate.js';
import { boxes, curTurn, drawCountEl } from './dom.js';



//highlights oldest piece for player before deleting 
export function highlightOldest(player) {
    if(!infiniteMode) return;
    let ageArray = player === "X" ? xAge : oAge;
    if (ageArray.length === MAX_ACTIVE_PIECES) {
        boxes[ageArray[0]].style.color = "red";
    }
}

//checks if the index is the oldest piece 
export function isOldest(index,player){
    if(player === "X"){
        return xAge[0] === index;
    }else if(player === "O"){
        return oAge[0] === index;
    }
    return false;
}

//Clears a box
export function clearBox(index){
    currBoard[index] = "";
    boxes[index].textContent = "";
    boxes[index].style.color = "white";
}

//checks if there is a 3 in a row and highlights them to gold
export function checkGameOver(){
    for (let condition of WINNING_COMBO) {
        const [a, b, c] = condition;
        if (currBoard[a] &&
            currBoard[a] === currBoard[b] &&
            currBoard[a] === currBoard[c]) {
            boxes[a].style.color = "gold";
            boxes[b].style.color = "gold";
            boxes[c].style.color = "gold";
            gameActive = false;
            if (currBoard[a] === "X") {
                xWins++;
                curTurn.textContent = `Player ${curPlayer} wins!`;
            } else {
                oWins++;
                if(singlePlayer){
                    curTurn.textContent = `Computer wins!`;
                }else{
                    curTurn.textContent = `Player ${curPlayer} wins!`;
                }
                updateScoreboard();
                return;
            }
        }
        if(!infiniteMode  && currBoard.every(cell => cell !== "")){
            gameActive = false;
            drawCount++;
            curTurn.textContent = "It's a draw";
            boxes.forEach((boxes,i) => {
                boxes.style.color = "red";
            });
            updateScoreboard();
        }
    }
}

function updateScoreboard(){
    document.getElementById("xWins").textContent = xWins;
    document.getElementById("oWins").textContent = oWins;
    document.getElementById("drawCount").textContent = drawCount;
} 

//in charge of placing the X and O on board
export function placeMove(index, player) {
    let ageArray = player === "X" ? xAge : oAge;
    if(infiniteMode){
        if (ageArray.length === MAX_ACTIVE_PIECES) {
            let oldIndex = ageArray.shift();
            clearBox(oldIndex);
        }
        ageArray.push(index);
    }
    currBoard[index] = player;
    boxes[index].textContent = player;
}