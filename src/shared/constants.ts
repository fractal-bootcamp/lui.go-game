
export const blackString = "Black";
export const whiteString = "White";

export const blackLetter = blackString[0];
export const whiteLetter = whiteString[0];
export const emptyLetter = "E";
export const outsideLetter = "X";


export type WinState = {
    outcome: string | null;
    winner: string | null;
  };

export type Game = {
  id: string,
  gameBoard: string[][],
  bIsNext: boolean,
  winState: { outcome: "WIN" | "TIE" | null, winner: "X" | "O" | null },
  player1: { token: string, id: string },
  player2: { token: string, id: string },
}