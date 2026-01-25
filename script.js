//elements
const boxes = document.querySelectorAll(".box");//for each tictactoe box
const curTurn = document.getElementById("status");//current turn
const rBtn = document.getElementById("reset");//reset button

//game states
let xWins = 0;//how many wins x has
let oWins = 0;//how many wins 0 has
let drawCount = 0;//how many draws needed only if not infinite 
let gameActive = true;//check if game is still active 
let currBoard = Array(9).fill("");//current board look
let xAge = [];//tracks x move and oldest 
let oAge =[];//tracks 0 move and oldest 

//all winning moves
const winsCond = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//highlights oldest piece for player before deleting 
function highlightOldestX() {
    boxes.forEach((box, i) => {
        if (currBoard[i] && box.style.color !== "gold") {
            box.style.color = "white";
        }
    });
    if (xAge.length === 3) {
        let oldest = xAge[0];
        boxes[oldest].style.color = "red";
    }
}

//checks if there is a 3 in a row and highlights them to gold
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
    let boardCopy = [...currBoard];
    let move = minimaxDecision(boardCopy);
    if (move !== null && gameActive) {  
        placeMove(move, "O");
        checkGameOver();
        highlightOldestX();
    }
}

//in charge of placing the X and O on board
function placeMove(index, player) {
    let ageArray = player === "X" ? xAge : oAge;
    if (ageArray.length === 3) {
        let oldIndex = ageArray.shift();
        currBoard[oldIndex] = "";
        boxes[oldIndex].textContent = "";
        boxes[oldIndex].style.color = "white";
    }
    currBoard[index] = player;
    boxes[index].textContent = player;
    ageArray.push(index);
}

//if logic doesnt work check tictactoe.java code
//decide on best possible move for computer to make
//prunes all bad moves
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

//place a X for computer to simulate player
//returns index of worst possible move for computer
function minValue(gameBoard, alpha, beta){
	if(isGameOver(gameBoard)){
		return scoreGame(gameBoard);
	}

	let value = Infinity;
	let list = getValidMovies(gameBoard);

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
	if(isGameOver(gameBoard)){
		return scoreGame(gameBoard);
	}

	let value = -Infinity;
	let list = getValidMovies(gameBoard);

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
//accidentally called it movies instead of moves
function getValidMovies(board){
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
	if (winner === "O"){
		return 1;
	}
	if (winner === "X"){
		return -1;
	}
	return 0;
} 

//check who won the game for scoreboard
function whoWon(board){
	for(let [a,b,c] of winsCond) {
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
        const index = box.dataset.index;
        if (!gameActive || currBoard[index] !== "") return;
        placeMove(index, "X");
        checkGameOver();
        highlightOldestX();
        if (gameActive) {
            curTurn.textContent = "Computer Thinking ...";
            setTimeout(() => {
                if (!gameActive) return; 
                computerMove();
            }, 200);
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
    highlightOldestX();
});
