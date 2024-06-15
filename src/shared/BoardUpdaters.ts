import {
  blackLetter,
  whiteLetter,
  emptyLetter,
  GameScore,
  Game,
} from "../shared/constants";

import { assessLibertyAcrossBoard } from "../shared/BoardAssessors";

import { textBoardGenerator } from "./ArrayGenerator";

export const addNewStone = (
  board: string[][],
  rowNum: number,
  colNum: number,
  bIsNext: boolean
): string[][] => {
  // This takes in a game board state and a move
  // and returns an updated board with that move incorporated
  const newBoard = structuredClone(board);
  if (board[rowNum][colNum] != emptyLetter) {
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.");
  }
  newBoard[rowNum][colNum] = bIsNext ? blackLetter : whiteLetter;
  return newBoard;
};

export const removeCapturedStonesOneCycle = ({
  game,
  setGame,
  gameBoard,
  libertyBoard,
  gameScore,
  setGameScore,
}: {
  game: Game;
  setGame: Function;
  gameBoard: string[][];
  libertyBoard: string[][];
  gameScore: GameScore;
  setGameScore: Function;
}): string[][] => {
  const newGameBoard = structuredClone(gameBoard);

  let newCaptivesB2W = 0;
  let newCaptivesW2B = 0;

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // On libertyBoard, empty string at this stage means we have confirmed they do not have liberties
      if (libertyBoard[i][j] == "") {
        if (gameBoard[i][j] === blackLetter) {
          newCaptivesB2W += 1;
          setGameScore({
            ...gameScore,
            blackStonesLostToWhite:
              gameScore.blackStonesLostToWhite + newCaptivesB2W,
          });
          const newGameScore = {
            ...game.gameScore,
            blackStonesLostToWhite:
              gameScore.blackStonesLostToWhite + newCaptivesB2W,
          };
          setGame({ ...game, gameScore: newGameScore });
        } else if (gameBoard[i][j] === whiteLetter) {
          newCaptivesW2B += 1;
          setGameScore({
            ...gameScore,
            whiteStonesLostToBlack:
              gameScore.whiteStonesLostToBlack + newCaptivesW2B,
          });
          const newGameScore = {
            ...game.gameScore,
            whiteStonesLostToBlack:
              gameScore.whiteStonesLostToBlack + newCaptivesW2B,
          };
          setGame({ ...game, gameScore: newGameScore });
        }
        newGameBoard[i][j] = emptyLetter;
      }
    }
  }
  return newGameBoard;
};

export const removeCapturedStones = (
  game: Game,
  setGame: Function,
  setGameScore: Function
) => {
  // We don't need to run our heavy algos if a user has just passed
  if (game.passCount === 0) {
    // We run this once where we treat the player who just moved as "Safe"
    const freshLibertyBoard = assessLibertyAcrossBoard({
      gameBoard: game.gameBoard,
      libertyBoard: textBoardGenerator(game.gameBoard.length, ""),
      focusOnBlack: game.bIsNext,
    });
    const freshGameBoard = removeCapturedStonesOneCycle({
      game: game,
      setGame: setGame,
      gameBoard: game.gameBoard, //delete
      libertyBoard: freshLibertyBoard, //DON'T delete
      gameScore: game.gameScore, // delete
      setGameScore: setGameScore, // delete
    });

    // Then we run it again to assess for suicides
    const freshLibertyBoard2 = assessLibertyAcrossBoard({
      gameBoard: freshGameBoard,
      libertyBoard: textBoardGenerator(game.gameBoard.length, ""),
      focusOnBlack: !game.bIsNext,
    });
    const freshGameBoard2 = removeCapturedStonesOneCycle({
      game: game,
      setGame: setGame,
      gameBoard: freshGameBoard,
      libertyBoard: freshLibertyBoard2,
      gameScore: game.gameScore,
      setGameScore: setGameScore,
    });

    if (JSON.stringify(game.gameBoard) != JSON.stringify(freshGameBoard2)) {
      console.log("Stone(s) have been captured.");
      //   setBoard(freshGameBoard2);
      console.log("state version:", game.gameBoard);
      console.log("fresh version:", freshGameBoard2);
      setGame({ ...game, gameBoard: freshGameBoard2 });
      console.log("new state version:", game.gameBoard);
    }
  }

  return game;
};
