import express from "express";
import cors from "cors";

import { PORT, Game, exampleGameForServer } from "../shared/constants";

import { addNewStone, removeCapturedStones } from "../shared/BoardUpdaters";

import { textBoardGenerator } from "../shared/ArrayGenerator";

const app = express();

// add json handling
app.use(express.json());
// add cors
app.use(cors());

// ADD IN game initialization requirements here (e.g. empty board, strings)

export type GamesDict = Record<string, Game>;

const gamesDict: GamesDict = {
  "online-game-1": exampleGameForServer,
};

// Keep Influence on the client

app.get("/", (_req, res) => {
  res.send("Hello World");
});

// Get a game
app.get("/game/:id", (req, res) => {
  const id = req.params.id;
  const game = gamesDict[id];

  // If no game found
  if (!game) {
    return res.status(404).send("Game not found (GET)");
  } else console.log("Well formed GET request for game:", id);

  // We'll pass back the game object
  res.json({ game: game });
});

app.post("/game/:id/move", (req, res) => {
  const id = req.params.id;
  const game = gamesDict[id];

  const { rowNum } = req.body;
  const { colNum } = req.body;

  // If no game is found

  if (!game) {
    return res.status(404).send("Game not found (POST /move)");
  }

  console.log("well formed POST request for", rowNum, colNum);

  const updatedGame1 = addNewStone(game, rowNum, colNum);
  const updatedGame2 = removeCapturedStones(updatedGame1);

  gamesDict[id] = updatedGame2;

  console.log("updatedGame is", updatedGame2);

  res.json(updatedGame2);
});

app.post("/game/:id/reset", (req, res) => {
  console.log("RESET ATTEMPT");
  const id = req.params.id;
  const oldGame = gamesDict[id];

  if (!oldGame) {
    return res.status(404).send("Game not found (POST /reset)");
  }

  const newBoard = structuredClone(textBoardGenerator(9, "E")); // Only small games on the server for now
  // ADD IN WINSTATE HERE LATER

  const newGame = {
    ...oldGame,
    board: newBoard,
    bIsNext: true,
    passCount: 0,
    moveCount: 0,
  };

  gamesDict[id] = newGame;

  console.log("RESET DETECETED - Let's see the whole gamesDict:", gamesDict);

  res.json(newGame);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
