import express from "express";
import cors from "cors";

import { Game, exampleGame } from "../shared/constants";

// import { updateGameWithMove } from "../shared/BoardUpdaters";

import { textBoardGenerator } from "../shared/ArrayGenerator";

const app = express();

// add json handling
app.use(express.json());

// add cors
app.use(cors());

// ADD IN game initialization requirements here (e.g. empty board, strings)

export type GamesDict = Record<string, Game>;

const gamesDict: GamesDict = {
  "fuzzy-cow": exampleGame,
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
  }

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

  const updatedGame = { ...updateGameWithMove(game, rowNum, colNum) };

  res.json({ updatedGame });
});

app.post("/game/:id/reset", (req, res) => {
  const id = req.params.id;
  const game = gamesDict[id];

  if (!game) {
    return res.status(404).send("Game not found (POST /reset)");
  }

  game.board = structuredClone(textBoardGenerator(9, "E"));
  // ADD IN WINSTATE HERE LATER
  game.bIsNext = true;

  res.json({ game });
});

const PORT = 4001;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
