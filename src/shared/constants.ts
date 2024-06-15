import { textBoardGenerator } from "../shared/ArrayGenerator";

export const blackString = "Black";
export const whiteString = "White";

export const blackLetter = blackString[0];
export const whiteLetter = whiteString[0];
export const emptyLetter = "E";
export const outsideLetter = "X";

export const boardLengthDict = {
  Small: 9,
  Medium: 13,
  Large: 19,
  // Any new values here will also need to be added to UserSettings type
};

export type WinState = {
  outcome: string | null;
  winner: string | null;
};

export type GameScore = {
  blackStonesLostToWhite: number;
  whiteStonesLostToBlack: number;
};

export type Game = {
  id: string;
  board: string[][];
  bIsNext: boolean;
  passCount: number;
  gameScore: GameScore;
  winState: { outcome: "WIN" | "TIE" | null; winner: "X" | "O" | null };
  player1: { token: string; id: string };
  player2: { token: string; id: string };
};

export const exampleGame = {
  id: "fuzzy-cow",
  board: structuredClone(textBoardGenerator(9, "E")),
  bIsNext: true,
  passCount: 0,
  gameScore: { blackStonesLostToWhite: 0, whiteStonesLostToBlack: 0 },
  winState: { outcome: null, winner: null },
  player1: { token: "player1", id: "player1" },
  player2: { token: "player2", id: "player2" },
};
