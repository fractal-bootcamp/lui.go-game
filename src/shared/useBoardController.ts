import { useEffect, useState } from "react";

import {
  blackString,
  whiteString,
  blackLetter,
  whiteLetter,
  emptyLetter,
  boardLengthDict,
  UserSettings,
  Game,
  GameScore,
  exampleGame,
} from "../shared/constants";

export const useBoardController = (mode: string) => {
  const [soloGame, setSoloGame] = useState<Game>(structuredClone(exampleGame));
  const [serverGame, setServerGame] = useState<Game>(
    structuredClone(exampleGame)
  );

  let activeGame = soloGame;
  let setActiveGame = setSoloGame;
  // const [activeGame, setGame] = useState<Game>(soloGame);
  // const [setActiveGame, setSetFunction] = useState<Function>(() => setSoloGame);

  useEffect(() => {
    if (mode === "Solo") {
      activeGame = soloGame;
      setActiveGame = setSoloGame;
      // setGame(soloGame);
      // setSetFunction(() => setSoloGame);
    } else if (mode === "Online") {
      activeGame = serverGame;
      setActiveGame = setServerGame;
      // setGame(serverGame);
      // setSetFunction(() => setServerGame);
    } else {
      console.log("WARNING: Invalid value passed to useBoardController.");
    }
  }, [mode]);

  console.log("Mode is:", mode);

  return { activeGame, setActiveGame };
};

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
