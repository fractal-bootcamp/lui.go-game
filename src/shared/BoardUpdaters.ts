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
}: {
  game: Game;
  setGame: Function;
  gameBoard: string[][];
  libertyBoard: string[][];
  gameScore: GameScore;
}): string[][] => {
  const newGameBoard = structuredClone(game.gameBoard);

  let newCaptivesB2W = 0;
  let newCaptivesW2B = 0;

  for (let i = 0; i < game.gameBoard.length; i++) {
    for (let j = 0; j < game.gameBoard.length; j++) {
      // On libertyBoard, empty string at this stage means we have confirmed they do not have liberties
      if (libertyBoard[i][j] == "") {
        if (game.gameBoard[i][j] === blackLetter) {
          newCaptivesB2W += 1;
          //   const newGameScore = {
          //     ...game.gameScore,
          //     blackStonesLostToWhite: game.gameScore.blackStonesLostToWhite + 1,
          //   };
          //   console.log(newCaptivesB2W, "black stones captured");

          //   setGame({
          //     ...game,
          //     passCount: 999999999,
          //   });

          //   console.log("passCount", game.passCount);

          //   console.log(game, "game");
          //   console.log(game.gameScore, "gameScore");

          //   console.log(game.gameScore, "this is new gameScore in state");
        } else if (game.gameBoard[i][j] === whiteLetter) {
          newCaptivesW2B += 1;
          //   const newGameScore = {
          //     ...game.gameScore,
          //     whiteStonesLostToBlack:
          //       gameScore.whiteStonesLostToBlack + newCaptivesW2B,
          //   };
          //   setGame({ ...game, gameScore: newGameScore });
        }
        newGameBoard[i][j] = emptyLetter;
      }
    }
  }
  setGame({
    ...game,
    gameScore: {
      blackStonesLostToWhite: newCaptivesB2W,
      whiteStonesLostToBlack: newCaptivesW2B,
    },
  });
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
      game: game,
      setGame: setGame,
      gameBoard: game.gameBoard, //delete
      libertyBoard: freshLibertyBoard, //DON'T delete
      gameScore: game.gameScore, // delete
    });

    // Then we run it again to assess for suicides
    const freshLibertyBoard2 = assessLibertyAcrossBoard({
      gameBoard: freshGameBoard,
      libertyBoard: textBoardGenerator(game.gameBoard.length, ""),
      focusOnBlack: !game.bIsNext,
    });
    const freshGameBoard2 = removeCapturedStonesOneCycle({
      game: { ...game, gameBoard: freshGameBoard },
      setGame: setGame,
      gameBoard: freshGameBoard,
      libertyBoard: freshLibertyBoard2,
      gameScore: game.gameScore,
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
