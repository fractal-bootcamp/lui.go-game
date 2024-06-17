import { useEffect, useState } from "react";

import { textBoardGenerator } from "../shared/ArrayGenerator";

import { emptyLetter, Game, exampleGame } from "../shared/constants";

import {
  getGameFromServer,
  voluntaryPassServer,
  refreshBoardServer,
  onTileClickServer as sendMoveToServer,
} from "../client/ServerCalls";

import { addNewStone } from "../shared/BoardUpdaters";

// const {getGame, playMove, resetGame, passMove} = useBoardController

// Game               -> getGame          -> Game
// Game, row, col     -> playMove         -> Game
// Game               -> resetGame        -> Game
// Game               -> passMove         -> Game

export const useBoardController = (mode: string) => {
  const [activeGame, setActiveGame] = useState<Game>(
    structuredClone(exampleGame)
  );

  let getGame = async (game: Game): Promise<Game> => {
    return game;
  };
  let playMove = (game: Game, _rowNum: number, _colNum: number): Game => {
    return game;
  };
  let resetGame = async (game: Game): Promise<Game> => {
    return game;
  };
  let passMove = (game: Game): Game => {
    return game;
  };

  useEffect(() => {
    console.log("useBoardController called, mode is", mode);

    if (mode === "Solo") {
      getGame = async (game: Game) => {
        console.log("Solo game fetch:", game.id);
        return activeGame;
      };

      playMove = (game: Game, rowNum: number, colNum: number) => {
        console.log("Solo playMove:", rowNum, colNum);
        const updatedGame = addNewStone(game, rowNum, colNum);
        setActiveGame(updatedGame);
        return updatedGame;
      };

      resetGame = async (game: Game) => {
        // newBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
        const newBoard = textBoardGenerator(9, emptyLetter);
        const updatedGame = { ...game, board: newBoard };
        setActiveGame(updatedGame);
        return updatedGame;
      };
      passMove = (game: Game) => {
        const updatedGame = {
          ...game,
          bIsNext: !game.bIsNext,
          passCount: game.passCount + 1,
        };
        setActiveGame(updatedGame);
        return updatedGame;
      };
    } else if (mode === "Online") {
      getGame = async (game: Game) => {
        // const refreshedGame = await getGameFromServer(game.id);
        console.log("Game passed in:", game);
        const refreshedGame = await getGameFromServer("online-game-1");
        return refreshedGame;
      };
      playMove = (game: Game, rowNum: number, colNum: number) => {
        console.log("Server playMove:", rowNum, colNum);
        const updatedGame = addNewStone(game, rowNum, colNum);
        sendMoveToServer(game.id, rowNum, colNum).then((res) =>
          setActiveGame(res)
        );
        return updatedGame;
      };
      resetGame = async (game: Game) => {
        const updatedGame = await refreshBoardServer(game);
        setActiveGame(updatedGame);
        return updatedGame;
      };
      passMove = (game: Game) => {
        const updatedGame = voluntaryPassServer(game);
        setActiveGame(updatedGame);
        return updatedGame;
      };
    } else {
      console.log("WARNING: Invalid value passed to useBoardController.");
    }
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
