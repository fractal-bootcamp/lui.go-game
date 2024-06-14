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
  gameBoard,
  libertyBoard,
  gameScore,
  setGameScore,
}: {
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
        } else if (gameBoard[i][j] === whiteLetter) {
          newCaptivesW2B += 1;
          setGameScore({
            ...gameScore,
            whiteStonesLostToBlack:
              gameScore.whiteStonesLostToBlack + newCaptivesW2B,
          });
        }
        newGameBoard[i][j] = emptyLetter;
      }
    }
  }

  // This is where I would expect to place the setGameScore function, but for some reason it causes
  // an infinite re-render loop. M
  // setGameScore({
  //   ...gameScore,
  //   // blackStonesLostToWhite:(gameScore.blackStonesLostToWhite+newCaptivesB2W),
  //   // whiteStonesLostToBlack:(gameScore.whiteStonesLostToBlack+newCaptivesW2B),
  //  })
  return newGameBoard;
};

export const removeCapturedStones = (game: Game, setGame: Function) => {
  // We don't need to run our heavy algos if a user has just passed
  if (game.passCount === 0) {
    // We run this once where we treat the player who just moved as "Safe"
    const freshLibertyBoard = assessLibertyAcrossBoard({
      gameBoard: game.gameBoard,
      libertyBoard: textBoardGenerator(game.gameBoard.length, ""),
      focusOnBlack: game.bIsNext,
    });
    const freshGameBoard = removeCapturedStonesOneCycle({
      gameBoard: game.gameBoard,
      libertyBoard: freshLibertyBoard,
      gameScore: game.gameScore,
      setGameScore: setGameScore,
    });

    // Then we run it again to assess for suicides
    const freshLibertyBoard2 = assessLibertyAcrossBoard({
      gameBoard: freshGameBoard,
      libertyBoard: textBoardGenerator(game.gameBoard.length, ""),
      focusOnBlack: !game.bIsNext,
    });
    const freshGameBoard2 = removeCapturedStonesOneCycle({
      gameBoard: freshGameBoard,
      libertyBoard: freshLibertyBoard2,
      gameScore: game.gameScore,
      setGameScore: setGameScore,
    });

    if (JSON.stringify(game.gameBoard) != JSON.stringify(freshGameBoard2)) {
      console.log("Stone(s) have been captured.");
      setBoard(freshGameBoard2);
    }
  }

  return game;
};
