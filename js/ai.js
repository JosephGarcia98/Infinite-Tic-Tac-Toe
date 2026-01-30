import { gameState, WINNING_COMBO } from './gamestate.js';
import { placeMove, isOldest, checkGameOver, highlightOldest } from './gamelogic.js';

//Functions for computer decision making
//called when player makes move
//starts the decision making
export function computerMove() {
    if (!gameState.gameActive) return; 
    let boardCopy = [...gameState.currBoard];
    let move = minimaxDecision(boardCopy);
    if (move !== null && gameState.gameActive) {  
    	if (isOldest(move, "O")) return;
        placeMove(move, "O");
        checkGameOver();
        if(gameState.gameActive)
        highlightOldest(gameState.curPlayer);
    }
}

//decide on best possible move for computer to make
//prunes all bad moves
export function minimaxDecision(gameBoard) {
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
export function minValue(gameBoard, alpha, beta){
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
export function maxValue(gameBoard, alpha, beta){
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
export function getValidMoves(board){
	let moves = [];
	for(let i=0; i < 9; i++){
		if(board[i] === "") moves.push(i);
	} 
	return moves;
}

//updates board temporary not for permanent changes
export function updateBoard(move, player, board){
	board[move] = player;
}

//score for Computer to make better moves
//return 1 for computers moves
//return -1 for player simulated moves
export function scoreGame(board){
	let winner = whoWon(board);
	if (winner === "O") return 1;
	if (winner === "X") return -1;
	return 0;
} 

//check who won the game for scoreboard
export function whoWon(board){
	for(let [a,b,c] of WINNING_COMBO) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]){
			return board[a];
		}
	}
	return null;
}

//make sure game is over passes to another method
//needed for futute proof of draws if wanna remove infinite functionality
export function isGameOver(board){
	return whoWon(board) !== null || board.every(cell => cell !== "");
}