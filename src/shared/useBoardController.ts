import { useEffect } from "react";

import { Game } from "../shared/constants";

const useBoardController = (mode: string): Function => {
  useEffect(() => {
    const soloVoluntaryPass = (game: Game, setGame: Function) => {
      setGame({
        ...game,
        bIsNext: !game.bIsNext,
        passCount: game.passCount + 1,
      });
      console.log("soloVoluntaryPass called");
    };

    const serverVoluntaryPass = (game: Game, setGame: Function) => {
      setGame({
        ...game,
        bIsNext: !game.bIsNext,
        passCount: game.passCount + 1,
      });
      console.log("serverVoluntaryPass called");
    };

    const voluntaryPass =
      mode === "solo" ? soloVoluntaryPass : serverVoluntaryPass;

    return { voluntaryPass };
  }, [mode]);
};

// //App.ts
// const { move, refresh } = useBoardController(mode)

// ...

// move()
