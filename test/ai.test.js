jest.mock("../src/gamestate/dom.js", () => ({
  mBtn: { textContent: "" },
  infiniteBtn: { textContent: "" },
  clearScoreBtn: { textContent: "" },
  drawCountEl: { textContent: "" },
  drawsLabel: { textContent: "" },
}));

import { minimaxDecision, whoWon, isGameOver, getValidMoves, scoreGame } from "../src/ai/ai.js";

beforeAll(() => {
  document.body.innerHTML = `
    <button id="playerMode"></button>
    <button id="infiniteBtn"></button>
    <button id="clearScoreBtn"></button>
    <div id="drawCount"></div>
    <div id="drawsLabel"></div>
  `;
});

describe("AI functionality", () => {
  test("detects winner correctly", () => {
    const board = ["X","X","X","","","","","",""];
    expect(whoWon(board)).toBe("X");
  });

  test("AI chooses winning move", () => {
    const board = ["O","O","","X","X","","","",""];
    const move = minimaxDecision(board);
    expect(move).toBe(2);
  });

  test("detects game over on full board", () => {
    const board = ["X","O","X","X","O","O","O","X","X"];
    expect(isGameOver(board)).toBe(true);
  });

  test("AI never selects an occupied cell", () => {
    const board = ["X","O","X","","","","","",""];
    const move = minimaxDecision(board);
    expect(board[move]).toBe("");
  });

  test("block opponent winning move", () => {
    const board = ["X","X","","O","","","","",""];
    const move = minimaxDecision(board);
    expect(move).toBe(2);
  });

  test("return null on full board for AI move", () => {
    const board = ["X","O","X","X","O","O","O","X","X"];
    const move = minimaxDecision(board);
    expect(move).toBeNull();
  });

  test("getValidMoves returns correct indices", () => {
    const board =  ["X","","O","","","","X","",""];
    expect(getValidMoves(board)).toEqual([1,3,4,5,7,8]);
  });

  test("scoreGame correctly scores draw", () => {
    const board =  ["X","O","X","X","O","O","O","X","X"];
    expect(scoreGame(board)).toBe(0);
  });
});