import { useEffect, useState } from "react";

import { textBoardGenerator } from "../shared/ArrayGenerator";

import { emptyLetter, Game, exampleGame, gamesDict } from "../shared/constants";

import {
  getGameFromServer,
  voluntaryPassServer,
  refreshBoardServer,
  onTileClickServer,
} from "../client/ServerCalls";

import { addNewStone } from "../shared/BoardUpdaters";

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

  const getGame =
    mode === "Solo"
      ? async (game: Game) => {
          console.log("Solo game fetch:", game.id);
          return soloGame;
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

    // if (mode === "Solo") {
    //   setSoloGame(structuredClone(exampleGame));
    // } else if (mode === "Online") {
    //   setSoloGame(gamesDict["online-game-1"]);
    // } else {
    //   console.log("WARNING: Invalid value passed to useBoardController.");
    // }
  }, [mode]);

  console.log("Mode is:", mode);

  return { activeGame, getGame, playMove, resetGame, passMove };
};

// export const useBoardControllerOG = (mode: string) => {
//   const [soloGame, setSoloGame] = useState<Game>(structuredClone(exampleGame));
//   const [serverGame, setServerGame] = useState<Game>(
//     structuredClone(exampleGame)
//   );

//   let activeGame = soloGame;
//   let setActiveGame = setSoloGame;
//   // const [activeGame, setGame] = useState<Game>(soloGame);
//   // const [setActiveGame, setSetFunction] = useState<Function>(() => setSoloGame);

//   useEffect(() => {
//     if (mode === "Solo") {
//       activeGame = soloGame;
//       setActiveGame = setSoloGame;
//       // setGame(soloGame);
//       // setSetFunction(() => setSoloGame);
//     } else if (mode === "Online") {
//       activeGame = serverGame;
//       setActiveGame = setServerGame;
//       // setGame(serverGame);
//       // setSetFunction(() => setServerGame);
//     } else {
//       console.log("WARNING: Invalid value passed to useBoardController.");
//     }
//   }, [mode]);

//   console.log("Mode is:", mode);

//   return { activeGame, setActiveGame };
// };

//
//
//
//
//
//
//
//
//
//
//
//
//

// //App.ts
// const { move, refresh } = useBoardController(mode)

// ...

// move()

//
//
//
//
//
//
//

// //// OG VERSION WHERE YOU PASS IN EACH FUNCTION INDIVIDUALLY

// export const useBoardController = (mode: string) => {
//   const [userPass, setUserPass] = useState<Function>(() => {});

//   useEffect(() => {
//     const soloPass = (game: Game): Game => {
//       // setGame({
//       //   ...game,
//       //   bIsNext: !game.bIsNext,
//       //   passCount: game.passCount + 1,
//       // });
//       // console.log("soloVoluntaryPass called");
//       return game;
//     };

//     const serverPass = (game: Game): Game => {
//       // setGame({
//       //   ...game,
//       //   bIsNext: !game.bIsNext,
//       //   passCount: game.passCount + 1,
//       // });
//       // console.log("serverVoluntaryPass called");
//       return game;
//     };

//     if (mode === "solo") {
//       setUserPass(soloPass);
//     } else if (mode === "server") {
//       setUserPass(serverPass);
//     } else {
//       console.log("WARNING: Invalid value passed to useBoardController.");
//     }
//   }, [mode]);

//   return { userPass };
// };

// // //App.ts
// // const { move, refresh } = useBoardController(mode)

// // ...

// // move()
