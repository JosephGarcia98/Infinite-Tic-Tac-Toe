import { boxes, rBtn, mBtn, infiniteBtn, settingBtn, closeSetting, curTurn, drawCountEl, oPlayer, drawsLabel, settingPanel } from './dom.js';
import { placeMove, checkGameOver, highlightOldest, updateScoreboard, isOldest } from './gamelogic.js';
import { computerMove } from './ai.js';
import { gameState } from './gamestate.js'; 

export function allEvents(){
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
        		highlightOldest("X");
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
    	gameState.currBoard = Array(9).fill("");
    	gameState.xAge = [];
    	gameState.oAge = [];
    	boxes.forEach(box => {
        	box.textContent = "";
        	box.style.color = "white";
    	});
    	gameState.gameActive = true;
    	curTurn.textContent = "Player X's turn";
    	highlightOldest(gameState.curPlayer);
	});

	//allows players to switch between single and two player mode
	//only allows it at the end or start of a game
	//also changes the scoreboard
	mBtn.addEventListener("click", () => {
		if(gameState.currBoard.every(cell => cell === "") || gameState.gameActive === false){
			gameState.singlePlayer = !gameState.singlePlayer; 
			mBtn.textContent = gameState.singlePlayer ? "Single Player" : "Two Player";
			oPlayer.textContent = gameState.singlePlayer ? "Computer Wins:" : "Player O Wins:";
			gameState.xWins = gameState.oWins =0;
			document.getElementById("xWins").textContent = gameState.xWins;
			document.getElementById("oWins").textContent = gameState.oWins;
			gameState.curPlayer = "X";
		}
	});

	settingBtn.addEventListener("click", () =>{
		settingPanel.classList.toggle("hidden");
	});

	closeSetting.addEventListener("click", () =>{
		settingPanel.classList.toggle("hidden");
	});

	infiniteBtn.addEventListener("click", () =>{
		if(gameState.currBoard.every(cell => cell === "") || gameState.gameActive === false){
			gameState.infiniteMode = !gameState.infiniteMode;
			infiniteBtn.textContent = gameState.infiniteMode ? "Infinite Mode" : "Finite Mode";
			drawCountEl.classList.toggle("hidden");
			drawsLabel.classList.toggle("hidden");

		}
	});
}