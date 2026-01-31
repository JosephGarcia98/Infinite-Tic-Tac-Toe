import { allEvents } from './event.js';
import { curTurn, mBtn, infiniteBtn } from './dom.js';
import { highlightOldest } from './gamelogic.js';
import { gameState } from './gamestate.js';

//run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    //set text
    curTurn.textContent = "Player X's turn";
    infiniteBtn.textContent = "Infinite\nMode";
    //sets up events
    allEvents();
    highlightOldest(gameState.curPlayer);
});
