export const gameState = {
xWins: 0,//how many wins X has
oWins: 0,//how many wins O has
drawCount: 0,//how many draws needed only if not infinite 
gameActive: true,//check if game is still active 
currBoard: Array(9).fill(""),//current board look
xAge: [],//tracks X move and oldest 
oAge: [],//tracks O move and oldest 
curPlayer: "X",//the current player either X or O
singlePlayer: true,//if true computer plays
infiniteMode: true,//decide if the game well be regular or infinite
}

export const MAX_ACTIVE_PIECES = 3;
export const MAX_BOARD = 9;

//all winning moves
export const WINNING_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];