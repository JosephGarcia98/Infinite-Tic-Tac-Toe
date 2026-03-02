import { allEvents } from './event/event.js';
import { curTurn, infiniteBtn } from './gamestate/dom.js';
import { highlightOldest } from './gamestate/gamelogic.js';
import { gameState } from './gamestate/gamestate.js';

//run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    //set text
    curTurn.textContent = "Player X's turn";
    infiniteBtn.textContent = "Infinite\nMode";
    //sets up events
    allEvents();
    highlightOldest(gameState.curPlayer);
});
