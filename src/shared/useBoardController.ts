import { useEffect, useState } from "react";

import { Game } from "../shared/constants";

const useBoardController = (mode: string) => {
  const [userPass, setUserPass] = useState<Function>(() => {});

  useEffect(() => {
    const soloPass = (game: Game): Game => {
      // setGame({
      //   ...game,
      //   bIsNext: !game.bIsNext,
      //   passCount: game.passCount + 1,
      // });
      // console.log("soloVoluntaryPass called");
      return game;
    };

    const serverPass = (game: Game): Game => {
      // setGame({
      //   ...game,
      //   bIsNext: !game.bIsNext,
      //   passCount: game.passCount + 1,
      // });
      // console.log("serverVoluntaryPass called");
      return game;
    };

    if (mode === "solo") {
      setUserPass(soloPass);
    } else if (mode === "server") {
      setUserPass(serverPass);
    } else {
      console.log("WARNING: Invalid value passed to useBoardController.");
    }
  }, [mode]);

  return { userPass };
};

// //App.ts
// const { move, refresh } = useBoardController(mode)

// ...

// move()
