import { PORT, Game } from "../shared/constants";

import "./App.css";

const serverPath = `http://localhost:${PORT}`;

export const getGameFromServer = async (id: string) => {
  const response = await fetch(`${serverPath}/game/${id}`);
  const json = await response.json();
  console.log("getGame json", json.game);
  return json.game;
};

export const voluntaryPassServer = (game: Game) => {
  return { ...game, bIsNext: !game.bIsNext, passCount: game.passCount + 1 };
};

export const refreshBoardServer = async (game: Game) => {
  console.log("refreshBoardServer json", game);
  const response = await fetch(`${serverPath}/game/${game.id}/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const newGame = await response.json();
  return newGame;
};

export const onTileClickServer = async (
  id: string,
  rowNum: number,
  colNum: number
) => {
  const response = await fetch(`${serverPath}/game/${id}/move`, {
    method: "POST",
    body: JSON.stringify({ rowNum, colNum }), // id is already included in path
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  console.log("makeAMove json:", json);
  return json;
  //  On client version, what happens here is...
  //   const updatedGame = addNewStone(game, rowNum, colNum);
  //   setGame(updatedGame);
  //  May make sense to calculate these IN this function and respond with the refreshed game state here
};
