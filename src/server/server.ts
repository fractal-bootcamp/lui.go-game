import express from "express"
import cors from "cors";

import {textBoardGenerator} from '../components/ArrayGenerator'


const app = express()

// add json handling
app.use(express.json())

// add cors
app.use(cors())

// ADD IN game initialization requirements here (e.g. empty board, strings)

let gamesDict = {
    ["fuzzy-cow"]: {
        id: "fuzzy-cow",
        board: structuredClone(textBoardGenerator(9, "E")),
        bIsNext: true
    }    
}


// ADD IN playMove takes in game, rowNum, colNum, and returns a game
const updateGameWithMove = ({game, rowNum, colNum} : {game, rowNum: number, colNum: number}) => {
    return game
}

// Keep Influence on the client


app.get("/", (req, res) =>{
    res.send("Hello World");
}
)

// Get a game
app.get("/game/:id", (req, res) => {
    const id = req.params.id;
    const game = gamesDict[id]

    // If no game found
    if (!game) {
        return res.status(404).send("Game not found (GET)")
    }

    // We'll pass back the game object
    res.json({ game: game})
}
)


app.post("/game/:id/move", (req, res) => {
    const id = req.params.id
    const game = gamesDict[id]

    const { rowNum } = req.body;
    const { colNum } = req.body;

    // If no game is found
    
    if (!game) {
        return res.status(404).send("Game not found (POST /move)");
    }

    const updatedGame = {...updateGameWithMove(game)}

    res.json({updatedGame})
}
)

app.post("/game/:id/reset", (req, res) => {
    const id = req.params.id
    const game = gamesDict[id]

    if (!game) {
        return res.status(404).send("Game not found (POST /reset)");
    }

    game.board = structuredClone(textBoardGenerator(9, "E"))
    // ADD IN WINSTATE HERE LATER
    game.bIsNext = true

    res.json({game})

})

const PORT = 4001

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})