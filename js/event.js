import { boxes, rBtn, mBtn, infiniteBtn, curTurn, drawCountEl, oPlayer, drawsLabel, clearScoreBtn} from './dom.js';
import { placeMove, checkGameOver, highlightOldest, updateScoreboard, isOldest, clearBoard } from './gamelogic.js';
import { computerMove } from './ai.js';
import { gameState } from './gamestate.js'; 

export function allEvents(){
	//when a box is clicked
	boxes.forEach(box => {
 	   box.addEventListener("click", () => {
 	   		if(!gameState.gameActive) return;
        	const index = Number(box.dataset.index);
            if (!gameState.infiniteMode && gameState.currBoard[index] !== "") return;
            if(gameState.infiniteMode && gameState.currBoard[index] !== "" && !isOldest(index, gameState.curPlayer))
                return;
        	placeMove(index, gameState.curPlayer);
        	checkGameOver();
        	if (gameState.gameActive) {
        		highlightOldest(gameState.curPlayer);
        		if (gameState.singlePlayer) {
        			if (gameState.curPlayer === "X") {
                	curTurn.textContent = 'Computer Thinking ...';
                	gameState.curPlayer = "O"; 
                	setTimeout(() => {
                    	if (!gameState.gameActive) return;
                    	computerMove(); 
                    	gameState.curPlayer = "X"; 
                    	if(gameState.gameActive)
                    	curTurn.textContent = `Player ${gameState.curPlayer}'s turn`;
                	}, 200);
            	}
        	}else{
        		gameState.curPlayer = gameState.curPlayer === "X" ? "O" : "X";
        		curTurn.textContent = `Player ${gameState.curPlayer}'s turn`;
        		}
        	}
    	});
	});

	//when reset button is pressed
	rBtn.addEventListener("click", () => {
		clearBoard();
	});

	//allows players to switch between single and two player mode
	//also changes the scoreboard
	mBtn.addEventListener("click", () => {
		gameState.singlePlayer = !gameState.singlePlayer; 
		mBtn.textContent = gameState.singlePlayer ? "Single\nPlayer" : "Two\nPlayer";
		oPlayer.textContent = gameState.singlePlayer ? "Computer Wins:" : "Player O Wins:";
		updateScoreboard();
		gameState.curPlayer = "X";
		clearBoard();
		gameState.xWins = 0;
		gameState.oWins = 0;
		gameState.drawCount = 0;
		updateScoreboard();
	});

	//changes from infinite to finite
	infiniteBtn.addEventListener("click", () =>{
		gameState.infiniteMode = !gameState.infiniteMode;
		infiniteBtn.textContent = gameState.infiniteMode ? "Infinite\nMode" : "Finite\nMode";
		drawCountEl.classList.toggle("hidden");
		drawsLabel.classList.toggle("hidden");
		clearBoard();
		gameState.xWins = 0;
		gameState.oWins = 0;
		gameState.drawCount = 0;
		updateScoreboard();
	});

	//sets scoreboard to 0
	clearScoreBtn.addEventListener("click", () =>{
		gameState.xWins = 0;
		gameState.oWins = 0;
		gameState.drawCount = 0;
		updateScoreboard();
	});
}
