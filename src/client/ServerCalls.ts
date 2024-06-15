import {
  PORT,
  emptyLetter,
  boardLengthDict,
  UserSettings,
  Game,
} from "../shared/constants";

import {
  numberBoardGenerator,
  textBoardGenerator,
} from "../shared/ArrayGenerator";

import { useEffect, useState } from "react";

import "./App.css";

const serverPath = `http://localhost:${PORT}`;

export const getGame = async (id: string) => {
  const response = await fetch(`${serverPath}/game/${id}`);
  const json = await response.json();
  console.log("getGame json", json);
  return json;
};

export const voluntaryPassServer = (game: Game, setGame: Function) => {
  setGame({ ...game, bIsNext: !game.bIsNext, passCount: game.passCount + 1 });
};

export const refreshBoardServer = (
  game: Game,
  setGame: Function,
  userSettings: UserSettings
) => {
  const newBoard = textBoardGenerator(
    boardLengthDict[userSettings.boardSize],
    emptyLetter
  );
  setGame({ ...game, gameBoard: newBoard, bIsNext: true, passCount: 0 });
};

export const onTileClickServer = () => {
  //   const updatedGame = addNewStone(game, rowNum, colNum);
  //   setGame(updatedGame);
};
