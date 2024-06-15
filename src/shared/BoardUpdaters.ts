import {
  blackLetter,
  whiteLetter,
  emptyLetter,
  Game,
} from "../shared/constants";

import { assessLiberty } from "../shared/BoardAssessors";

import { textBoardGenerator } from "./ArrayGenerator";

export const addNewStone = (
  game: Game,
  rowNum: number,
  colNum: number
): Game => {
  // This takes in a game board state and a move
  // and returns an updated board with that move incorporated
  const oldBoard = game.board;
  const newBoard = structuredClone(oldBoard);
  if (oldBoard[rowNum][colNum] != emptyLetter) {
    console.log("ERROR: addNewStone attempted on occupied tile.");
  }
  newBoard[rowNum][colNum] = game.bIsNext ? blackLetter : whiteLetter;

  const updatedGame = { ...game, gameBoard: newBoard, bIsNext: !game.bIsNext };

  return updatedGame;
};

//
// buttonClick triggers addNewStone, which lays a stone and toggles bIsNext
//
// game, move details -> addNewStone -> game
//

// The change in game.board triggers useEffect, which hands the game state
// to removeCapturedStones, which will respond with a new game state. This
// new game state will then be set as THE game state.

// Within removeCapturedStones, we pass the game state for assessment, and
// then for kills, then for assessment again, and then for kills again.
//
// Assessment is handled by assessLiberty. This is recursive so it needs to
// be handed a blank board to start with.
//
// Kills are handled by removeCaptures.

// So we have:

// game ->
// - removeCapturedStones
// -- 1 - assessLiberty(game, focusOnBlack boolean) -> libertyAssessment
// -- 2 - removeCaptures(game, libertyAssessment) -> game
// -- 3 - assessLiberty(game, !focusOnBlack boolean) -> libertyAssessment
// -- 4 - removeCaptures(game, libertyAssessment) -> game
// -> game

export const removeCapturedStones = (game: Game): Game => {
  // We don't need to run this algo if a user has just passed
  if (game.passCount > 0) return game;

  // Phase 1, assess liberty, with the player who just moved as "Safe"
  const libertyBoard = assessLiberty(game, game.bIsNext);
  const updatedGamePass1 = removeCaptures({
    game: game,
    libertyBoard: libertyBoard,
  });

  // Then we run it again to assess for suicides
  const libertyBoard2 = assessLiberty(updatedGamePass1, game.bIsNext);
  const updatedGamePass2 = removeCaptures({
    game: updatedGamePass1,
    libertyBoard: libertyBoard2,
  });

  if (JSON.stringify(game.board) != JSON.stringify(updatedGamePass2.board)) {
    console.log("Stone(s) have been captured.");
  }
  return updatedGamePass2;
};

export const removeCaptures = ({
  game,
  libertyBoard,
}: {
  game: Game;
  libertyBoard: string[][];
}): Game => {
  let newCaptivesB2W = 0;
  let newCaptivesW2B = 0;

  const newBoard = structuredClone(game.board);

  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board.length; j++) {
      // On libertyBoard, empty string at this stage means we have confirmed they do NOT have liberties
      if (libertyBoard[i][j] == "") {
        if (game.board[i][j] === blackLetter) {
          newCaptivesB2W += 1;
        } else if (game.board[i][j] === whiteLetter) {
          newCaptivesW2B += 1;
        }
        newBoard[i][j] = emptyLetter;
      }
    }
  }
  const updatedGame = { ...game, board: newBoard };
  /// ADD IN HERE THE SCORE...
  return updatedGame;
};
