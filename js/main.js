import{ allEvents } from './event.js'
import { curTurn, mBtn, infiniteBtn } from './dom.js'
import { highlightOldest } from './gamelogic.js'

document.addEventListener("DOMContentLoaded", () => {
	curTurn.textContent = "Player X's turn";
    mBtn.textContent = "Single Player";
    infiniteBtn.textContent = "Infinite Mode";
	allEvents();
	highlightOldest("X")
});