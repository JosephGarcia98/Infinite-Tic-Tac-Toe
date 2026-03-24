jest.mock('../src/gamestate/dom.js', () => ({
  mBtn: { textContent: "" },
  infiniteBtn: { textContent: "" },
  clearScoreBtn: { textContent: "" },
  drawCountEl: {},
  drawsLabel: {},
  boxes: Array(9).fill({ textContent: "", style: { color: "white" } })
}));

import { placeMove, isOldest } from '../src/gamestate/gamelogic.js';
import { gameState } from '../src/gamestate/gamestate.js';

beforeEach(() => {
  if (!gameState.currBoard) gameState.currBoard = Array(9).fill("");
  if (!gameState.xAge) gameState.xAge = [];
  if (!gameState.oAge) gameState.oAge = [];
  gameState.infiniteMode = true;
});

describe("Game logic functionality", () => {
  test("removes oldest move when placing 4th piece", () => {
    gameState.xAge = [0, 1, 2];
    gameState.currBoard = ["X", "X", "X", "", "", "", "", "", ""];
    placeMove(3, "X");
    expect(gameState.currBoard[0]).toBe("");
    expect(gameState.currBoard[3]).toBe("X");
  });

  test("adds move correctly when under MAX_ACTIVE_PIECES", () => {
    gameState.xAge = [0, 1, 2];
    gameState.currBoard = ["X", "X", "X", "", "", "", "", "", ""];
    placeMove(3, "X");
    expect(gameState.currBoard[3]).toBe("X");
    expect(gameState.xAge).toEqual([1, 2, 3]);
  });

  test("isOldest correctly identifies oldest move", () => {
    gameState.xAge = [4, 5, 6];
    expect(isOldest(4, "X")).toBe(true);
    expect(isOldest(5, "X")).toBe(false);
  });

  test("isOldest returns false if player has no moves", () => {
    gameState.xAge = [];
    expect(isOldest(0, "X")).toBe(false);
  });

  test("isOldest returns false for other player's move", () => {
    gameState.oAge = [0, 1, 2];
    expect(isOldest(0, "X")).toBe(false);
  });
});