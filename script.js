//elements 
const boxes = document.querySelectorAll(".box");
const curTurn = document.getElementById("status");
const rBtn = document.getElementById("reset");

//ints
let xWins = 0;
let oWins = 0;
let drawCount = 0;

//winning moves
const winsCond = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//checkers
let gameActive = true;
let whereBlink = null;
let isItBlink = null;

//arrays
let currBoard = Array(9).fill("");
let xAge = [];
let oAge =[];

// Player clicked
boxes.forEach(box => {
	box.addEventListener("click", () => {
		const index = box.dataset.index;
		if (!gameActive || currBoard[index] !== "") return;

		// Player move
		placeMove(index, "X");
		checkGameOver();

		// AI move(text is just for show)
		if (gameActive) {
			curTurn.textContent = "Computer Thinking .";
			curTurn.textContent = "Computer Thinking ..";
			curTurn.textContent = "Computer Thinking ....";
			setTimeout(() => { computerMove(); }, 200); 
			curTurn.textContent = "Player X's Move";
		}
	});
});

//function called to make a move:remove?
//function makeMove(index, player){
//	currBoard[index] = player;
//	boxes[index].textContent = player;
//	checkGameOver();
//}

// Ai Section
function minimaxDecision(gameBoard) {
	let currentUtility = -Infinity;
	let emptyCellList = getValidMovies(gameBoard);
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


function minValue(gameBoard, alpha, beta, cutoff){
	if(isGameOver(gameBoard)){
		return scoreGame(gameBoard);
	}

	let value = Infinity;
	let list = getValidMovies(gameBoard);

	for (let move of list){
		let copyBoard = [...gameBoard];
		updateBoard(move, "X", copyBoard);
		let utility = maxValue(copyBoard, alpha, beta, cutoff);

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

function maxValue(gameBoard, alpha, beta, cutoff){
	if(isGameOver(gameBoard)){
		return scoreGame(gameBoard);
	}

	let value = -Infinity;
	let list = getValidMovies(gameBoard);

	for (let move of list){
		let copyBoard = [...gameBoard];
		updateBoard(move, "O", copyBoard);
		let utility = minValue(copyBoard, alpha, beta, cutoff);

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

// AI Assistants 
function getValidMovies(board){
	let moves = [];
	for(let i=0; i < 9; i++){
		if(board[i] === "") moves.push(i);
	} 
	return moves;
}

function updateBoard(move, player, board){
	board[move] = player;
}

function isGameOver(board){
	return whoWon(board) !== null || board.every(cell => cell !== "");
}

function scoreGame(board){
	let winner = whoWon(board);
	if (winner === "O"){
		return 1;
	}
	if (winner === "X"){
		return -1;
	}
	return 0;
} 

function whoWon(board){
	for(let [a,b,c] of winsCond) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]){
			return board[a];
		}
	}
	return null;
}

function checkGameOver(){
	for (let condition of winsCond) {
		const [a, b, c] = condition;

		if (currBoard[a] &&
			currBoard[a] === currBoard[b] &&
			currBoard[a] === currBoard[c]) {
			boxes[a].style.color = "gold";
			boxes[b].style.color = "gold";
			boxes[c].style.color = "gold";

			curTurn.textContent = `${currBoard[a]} wins!`;
			stopBlink();
			gameActive = false;

			if (currBoard[a] === "X") {
				xWins++;
			} else {
				oWins++;
			}
			break;
		}
	} 
	if (currBoard.every(cell => cell !== "")) {
		curTurn.textContent = "Its a draw";
		gameActive = false;
		drawCount++;

		boxes.forEach((box, index) => {
			if (currBoard[index] !== "") {
				box.style.color = "red"; 
			}
		});
	}

	document.getElementById("xWins").textContent = xWins;
	document.getElementById("oWins").textContent = oWins;
	document.getElementById("drawCount").textContent = drawCount;
}

// computer move function
function computerMove() {
	if (!gameActive) return;

	let boardCopy = [...currBoard];
	let move = minimaxDecision(boardCopy);

	if(move !== null){
		placeMove(move, "O");
		checkGameOver();
	}
}

//reset button
rBtn.addEventListener("click", () => {
	currBoard = Array(9).fill("");
	xAge = [];
	oAge = [];
	stopBlink();
	boxes.forEach(box => {
		box.textContent = "";
		box.style.color = "white";
	});
	gameActive = true;
	curTurn.textContent = "Player X's turn";
});