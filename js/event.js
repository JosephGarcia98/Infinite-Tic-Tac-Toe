import { boxes, rBtn, mBtn, infiniteBtn, settingBtn, closeSetting, curTurn, drawCountEl } from './dom.js';
import { placeMove, checkGameOver, highlightOldest, updateScoreboard } from './gamelogic.js';
import { computerMove } from './ai.js';
import { currBoard, curPlayer, singlePlayer, infiniteMode } from './gamestate.js'; 

export function allEvents(){
	boxes.forEach(box => {
 	   box.addEventListener("click", () => {
 	   		if(!gameActive) return;
        	const index = Number(box.dataset.index);
        	if(!infiniteMode && currBoard[index] !== "") return;
        	if(!infiniteMode && currBoard[index] !== "" && isOldest(index,curPlayer)) return;
        	placeMove(index, curPlayer);
        	checkGameOver();
        	if (gameActive) {
        		highlightOldest(curPlayer);
        		if (singlePlayer) {
        			if (curPlayer === "X") {
                	curTurn.textContent = 'Computer Thinking ...';
                	curPlayer = "O"; 
                	setTimeout(() => {
                    	if (!gameActive) return;
                    	computerMove(); 
                    	curPlayer = "X"; 
                    	if(gameActive)
                    	curTurn.textContent = `Player ${curPlayer}'s turn`;
                	}, 200);
            	}
        	}else{
        		curPlayer = curPlayer === "X" ? "O" : "X";
        		curTurn.textContent = `Player ${curPlayer}'s turn`;
        		}
        	}
    	});
	});

	//when reset button is pressed
	rBtn.addEventListener("click", () => {
    	currBoard = Array(9).fill("");
    	xAge = [];
    	oAge = [];
    	boxes.forEach(box => {
        	box.textContent = "";
        	box.style.color = "white";
    	});
    	gameActive = true;
    	curTurn.textContent = "Player X's turn";
    	highlightOldest(curPlayer);
	});

	//allows players to switch between single and two player mode
	//only allows it at the end or start of a game
	//also changes the scoreboard
	mBtn.addEventListener("click", () => {
		if(currBoard.every(cell => cell === "") || gameActive === false){
			singlePlayer = !singlePlayer; 
			mBtn.textContent = singlePlayer ? "Single Player" : "Two Player";
			oPlayer.textContent = singlePlayer ? "Computer Wins:" : "Player O Wins:";
			xWins = oWins =0;
			document.getElementById("xWins").textContent = xWins;
			document.getElementById("oWins").textContent = oWins;
			curPlayer = "X";
		}
	});

	settingBtn.addEventListener("click", () =>{
		settingPanel.classList.toggle("hidden");
	});

	closeSetting.addEventListener("click", () =>{
		settingPanel.classList.toggle("hidden");
	});

	infiniteBtn.addEventListener("click", () =>{
		if(currBoard.every(cell => cell === "") || gameActive === false){
			infiniteMode = !infiniteMode;
			infiniteBtn.textContent = infiniteMode ? "Infinite Mode" : "Finite Mode";
			drawCountEl.classList.toggle("hidden");
			drawsLabel.classList.toggle("hidden");

		}
	});
}