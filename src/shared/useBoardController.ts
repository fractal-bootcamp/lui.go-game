import { useEffect, useState } from "react";

import { textBoardGenerator } from "../shared/ArrayGenerator";

import { emptyLetter, Game, exampleGame, gamesDict } from "../shared/constants";

import {
  getGameFromServer,
  voluntaryPassServer,
  refreshBoardServer,
  onTileClickServer,
} from "../client/ServerCalls";

import { addNewStone, removeCapturedStones } from "../shared/BoardUpdaters";

// const {getGame, playMove, resetGame, passMove} = useBoardController

// Game               -> getGame          -> Game
// Game, row, col     -> playMove         -> Game
// Game               -> resetGame        -> Game
// Game               -> passMove         -> Game

export const useBoardController = (mode: string) => {
  const [soloGame, setSoloGame] = useState<Game>(structuredClone(exampleGame));
  const [serverGame, setServerGame] = useState<Game>(
    gamesDict["online-game-1"]
  );

  const syncGame =
    mode === "Solo"
      ? async (game: Game) => {
          console.log("Solo game fetch:", game.id);
          const refreshedGame = removeCapturedStones(game);
          setSoloGame(refreshedGame);
          return refreshedGame;
        }
      : async (game: Game) => {
          // const refreshedGame = await getGameFromServer(game.id);
          console.log("Game passed in:", game);
          const refreshedGame = await getGameFromServer("online-game-1");
          setServerGame(refreshedGame);
          return refreshedGame;
        };

  const playMove =
    mode === "Solo"
      ? (game: Game, rowNum: number, colNum: number) => {
          console.log("Solo playMove:", rowNum, colNum);
          const updatedGame = addNewStone(game, rowNum, colNum);
          setSoloGame(updatedGame);
          return updatedGame;
        }
      : async (game: Game, rowNum: number, colNum: number) => {
          // const refreshedGame = await getGameFromServer(game.id);
          console.log("Game passed in:", game);
          const refreshedGame = await onTileClickServer(
            "online-game-1",
            rowNum,
            colNum
          );
          setServerGame(refreshedGame);
          return refreshedGame;
        };

  const resetGame =
    mode === "Solo"
      ? async (game: Game) => {
          // newBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
          const newBoard = textBoardGenerator(9, emptyLetter);
          const updatedGame = { ...game, board: newBoard };
          setSoloGame(updatedGame);
          return updatedGame;
        }
      : async (game: Game) => {
          const updatedGame = await refreshBoardServer(game);
          setServerGame(updatedGame);
          return updatedGame;
        };

  const passMove =
    mode === "Solo"
      ? (game: Game) => {
          const updatedGame = {
            ...game,
            bIsNext: !game.bIsNext,
            passCount: game.passCount + 1,
          };
          setSoloGame(updatedGame);
          return updatedGame;
        }
      : (game: Game) => {
          const updatedGame = voluntaryPassServer(game);
          setServerGame(updatedGame);
          return updatedGame;
        };

  const activeGame = mode === "Solo" ? soloGame : serverGame;

  useEffect(() => {
    console.log("useBoardController called, mode is", mode);
  }, [mode]);

  console.log("Mode is:", mode);

  return { activeGame, syncGame, playMove, resetGame, passMove };
};
