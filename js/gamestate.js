export let xWins = 0;//how many wins X has
export let oWins = 0;//how many wins O has
export let drawCount = 0;//how many draws needed only if not infinite 
export let gameActive = true;//check if game is still active 
export let currBoard = Array(9).fill("");//current board look
export let xAge = [];//tracks X move and oldest 
export let oAge =[];//tracks O move and oldest 
export let curPlayer = "X"//the current player either X or O
export let singlePlayer = true;//if true computer plays
export let infiniteMode= true;//decide if the game well be regular or infinite
export const MAX_ACTIVE_PIECES = 3;
export const MAX_BOARD = 9;

//all winning moves
const WINNING_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];