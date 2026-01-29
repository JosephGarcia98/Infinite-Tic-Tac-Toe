import { allEvents } from './event.js';
import { curTurn, mBtn, infiniteBtn } from './dom.js';
import { highlightOldest } from './gamelogic.js';
import { gameState } from './gamestate.js';

document.addEventListener("DOMContentLoaded", () => {
    // Set initial UI text
    curTurn.textContent = "Player X's turn";
    mBtn.textContent = "Single Player";
    infiniteBtn.textContent = "Infinite Mode";

    // Initialize all event listeners
    allEvents();

    // Highlight the oldest piece (if applicable)
    highlightOldest(gameState.curPlayer);
});
