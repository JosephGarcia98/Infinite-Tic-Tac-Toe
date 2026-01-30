import { allEvents } from './event.js';
import { curTurn, mBtn, infiniteBtn } from './dom.js';
import { highlightOldest } from './gamelogic.js';
import { gameState } from './gamestate.js';

document.addEventListener("DOMContentLoaded", () => {
    curTurn.textContent = "Player X's turn";
    infiniteBtn.textContent = "Infinite\nMode";
    allEvents();
    highlightOldest(gameState.curPlayer);
});
