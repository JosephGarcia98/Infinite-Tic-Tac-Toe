import { gameState, MAX_ACTIVE_PIECES, WINNING_COMBO, } from './gamestate.js';
import { boxes, curTurn, drawCountEl } from './dom.js';



//highlights oldest piece for player before deleting 
export function highlightOldest(player) {
    if(!gameState.infiniteMode) return;
    let ageArray = player === "X" ? gameState.xAge : gameState.oAge;
    if (ageArray.length === MAX_ACTIVE_PIECES) {
        boxes[ageArray[0]].style.color = "red";
    }
}

//checks if the index is the oldest piece 
export function isOldest(index,player){
    if(player === "X"){
        return gameState.xAge[0] === index;
    }else if(player === "O"){
        return gameState.oAge[0] === index;
    }
    return false;
}

//Clears a box
export function clearBox(index){
    gameState.currBoard[index] = "";
    boxes[index].textContent = "";
    boxes[index].style.color = "white";
}

//checks if there is a 3 in a row and highlights them to gold
export function checkGameOver(){
    for (let condition of WINNING_COMBO) {
        const [a, b, c] = condition;
        if (gameState.currBoard[a] &&
            gameState.currBoard[a] === gameState.currBoard[b] &&
            gameState.currBoard[a] === gameState.currBoard[c]) {
            boxes[a].style.color = "gold";
            boxes[b].style.color = "gold";
            boxes[c].style.color = "gold";
            gameState.gameActive = false;
            if (gameState.currBoard[a] === "X") {
                gameState.xWins++;
                curTurn.textContent = `Player ${gameState.curPlayer} wins!`;
            } else {
                gameState.oWins++;
                if(gameState.singlePlayer){
                    curTurn.textContent = `Computer wins!`;
                }else{
                    curTurn.textContent = `Player ${gameState.curPlayer} wins!`;
                }
                updateScoreboard();
                return;
            }
        }
        if(!gameState.infiniteMode  && gameState.currBoard.every(cell => cell !== "")){
            gameState.gameActive = false;
            gameState.drawCount++;
            curTurn.textContent = "It's a draw";
            boxes.forEach((boxes,i) => {
                boxes.style.color = "red";
            });
            updateScoreboard();
        }
    }
}

export function updateScoreboard(){
    document.getElementById("xWins").textContent = gameState.xWins;
    document.getElementById("oWins").textContent = gameState.oWins;
    document.getElementById("drawCount").textContent = gameState.drawCount;
} 

//in charge of placing the X and O on board
export function placeMove(index, player) {
    let ageArray = player === "X" ? gameState.xAge : gameState.oAge;
    if(gameState.infiniteMode){
        if (ageArray.length === MAX_ACTIVE_PIECES) {
            let oldIndex = ageArray.shift();
            clearBox(oldIndex);
        }
        ageArray.push(index);
    }
    gameState.currBoard[index] = player;
    boxes[index].textContent = player;
}