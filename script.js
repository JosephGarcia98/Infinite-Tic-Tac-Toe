//elements
const boxes = document.querySelectorAll(".box");//for each tictactoe box
const curTurn = document.getElementById("status");//current turn
const rBtn = document.getElementById("reset");//reset button
const mBtn = document.getElementById("playerMode");//reset button
const MAX_ACTIVE_PIECES = 3;
mBtn.textContent = "Single Player";
xPlayer.textContent = "Player X Wins"
oPlayer.textContent = "Player O Wins"

//game states
let xWins = 0;//how many wins X has
let oWins = 0;//how many wins O has
let drawCount = 0;//how many draws needed only if not infinite 
let gameActive = true;//check if game is still active 
let currBoard = Array(9).fill("");//current board look
let xAge = [];//tracks X move and oldest 
let oAge =[];//tracks O move and oldest 
let curPlayer = "X"//the current player either X or O
let singlePlayer = true;//if true computer plays

//all winning moves
const WINNING_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//highlights oldest piece for player before deleting 
function highlightOldest(player) {
    let ageArray = player === "X" ? xAge : oAge;
    if (ageArray.length === MAX_ACTIVE_PIECES) {
        boxes[ageArray[0]].style.color = "red";
    }
}

//checks if the index is the oldest piece 
function isOldest(index,player){
	if(player === "X"){
		return xAge[0] === index;
	}else if(player === "O"){
		return oAge[0] === index;
	}
	return false;
}

//Clears a box
function clearBox(index){
	currBoard[index] = "";
	boxes[index].textContent = "";
	boxes[index].style.color = "white";
}

//checks if there is a 3 in a row and highlights them to gold
function checkGameOver(){
	for (let condition of WINNING_COMBO) {
		const [a, b, c] = condition;
		if (currBoard[a] &&
			currBoard[a] === currBoard[b] &&
			currBoard[a] === currBoard[c]) {
			boxes[a].style.color = "gold";
			boxes[b].style.color = "gold";
			boxes[c].style.color = "gold";
			curTurn.textContent = `${currBoard[a]} wins!`;
			gameActive = false;
			if (currBoard[a] === "X") {
				xWins++;
			} else {
				oWins++;
			}
			break;
		}
	}
	document.getElementById("xWins").textContent = xWins;
	document.getElementById("oWins").textContent = oWins;
}

//Functions for computer decision making
//called when player makes move
//starts the decision making
function computerMove() {
    if (!gameActive) return; 
    curTurn.textContent = "Player X's turn";
    let boardCopy = [...currBoard];
    let move = minimaxDecision(boardCopy);
    if (move !== null && gameActive) {  
    	if (isOldest(move, "O")) return;
        placeMove(move, "O");
        checkGameOver();
        highlightOldest(curPlayer);
    }
}

//in charge of placing the X and O on board
function placeMove(index, player) {
    let ageArray = player === "X" ? xAge : oAge;
    if (ageArray.length === MAX_ACTIVE_PIECES) {
        let oldIndex = ageArray.shift();
        clearBox(oldIndex);
    }
    currBoard[index] = player;
    boxes[index].textContent = player;
    ageArray.push(index);
}

//decide on best possible move for computer to make
//prunes all bad moves
function minimaxDecision(gameBoard) {
	let currentUtility = -Infinity;
	let emptyCellList = getValidMoves(gameBoard);
	let bestMove = null;
	let cutoff = Infinity;
	for(let row of emptyCellList){
		let alpha = -Infinity;
		let beta = Infinity;
		let copyBoard = [...gameBoard];
		updateBoard(row, "O", copyBoard);
		let utility = minValue(copyBoard, alpha, beta, cutoff);
		if(utility > currentUtility){
			currentUtility = utility;
			bestMove = row;
		}
	}
	return bestMove;
}

//place a X for computer to simulate player
//returns index of worst possible move for computer
function minValue(gameBoard, alpha, beta){
	if(isGameOver(gameBoard)) return scoreGame(gameBoard);
	let value = Infinity;
	let list = getValidMoves(gameBoard);

	for (let move of list){
		let copyBoard = [...gameBoard];
		updateBoard(move, "X", copyBoard);
		let utility = maxValue(copyBoard, alpha, beta);

		if(value > utility){
			value = utility;
		}

		if(value <= alpha){
			return value;
		}

		if(value < beta){
			beta = value;
		}
	}
	return value;
}

//plays a move for computer
//returns index of best possible move
function maxValue(gameBoard, alpha, beta){
	if(isGameOver(gameBoard)) return scoreGame(gameBoard);
	let value = -Infinity;
	let list = getValidMoves(gameBoard);

	for (let move of list){
		let copyBoard = [...gameBoard];
		updateBoard(move, "O", copyBoard);
		let utility = minValue(copyBoard, alpha, beta);

		if(value < utility){
			value = utility;
		}

		if(value >= beta){
			return value;
		}

		if(value > alpha){
			alpha = value;
		}
	}
	return value;
}

//call to get a empty spots or possible moves
function getValidMoves(board){
	let moves = [];
	for(let i=0; i < 9; i++){
		if(board[i] === "") moves.push(i);
	} 
	return moves;
}

//updates board temporary not for permanent changes
function updateBoard(move, player, board){
	board[move] = player;
}

//score for Computer to make better moves
//return 1 for computers moves
//return -1 for player simulated moves
function scoreGame(board){
	let winner = whoWon(board);
	if (winner === "O") return 1;
	if (winner === "X") return -1;
	return 0;
} 

//check who won the game for scoreboard
function whoWon(board){
	for(let [a,b,c] of WINNING_COMBO) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]){
			return board[a];
		}
	}
	return null;
}

//make sure game is over passes to another method
//needed for futute proof of draws if wanna remove infinite functionality
function isGameOver(board){
	return whoWon(board) !== null || board.every(cell => cell !== "");
}

//event handler  
//when the player clicks the boxes event
boxes.forEach(box => {
    box.addEventListener("click", () => {
    	if(!gameActive) return;
        const index = Number(box.dataset.index);
        if(currBoard[index] !== "" && !isOldest(index,curPlayer)) return;
        if(isOldest(index,curPlayer)){
        	xAge.shift();
        	clearBox(index);
        }
        placeMove(index, curPlayer);
        checkGameOver();
        if (gameActive) {
        	highlightOldest(curPlayer);
        	if (singlePlayer) {
        		if (curPlayer === "X") {
                curTurn.textContent = "Computer Thinking ...";
                curPlayer = "O"; 
                setTimeout(() => {
                    if (!gameActive) return;
                    computerMove(); 
                    curPlayer = "X"; 
                    curTurn.textContent = `Player ${curPlayer}'s turn`;
                }, 200);
            }
        }else{
        	curPlayer = curPlayer === "X" ? "O" : "X";
        	curTurn.textContent = `Player ${currentPlayer}'s turn`;
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
mBtn.addEventListener("click", () => {
	if(currBoard.every(cell => cell === "") || gameActive === false){
		singlePlayer = !singlePlayer; 
		mBtn.textContent = singlePlayer ? "Single Player" : "Two Player";
		oPlayer.textContent = singlePlayer ? "PLayer O Wins" : "Computer Wins";
		xWins = oWins =0;
		document.getElementById("xWins").textContent = xWins;
		document.getElementById("oWins").textContent = oWins;
		curPlayer = "X";
	}
});
