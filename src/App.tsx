import { useEffect, useState } from "react";

import { SizeDropdown } from "./components/DropDown";

import "./App.css";
import {
  numberBoardGenerator,
  textBoardGenerator,
} from "./components/ArrayGenerator";


const blackString = "Black";
const whiteString = "White";

const blackLetter = blackString[0];
const whiteLetter = whiteString[0];
const emptyLetter = "E";
const outsideLetter = "X";

// const boardLength = 9;
// const startingBoard = textBoardGenerator(boardLength, emptyLetter);
// const startingShadowBoard = textBoardGenerator(boardLength, "");
// const startingInfluenceBoard = numberBoardGenerator(boardLength, 0);

type TextBoard = string[][];
type NumberBoard = number[][];

const getUpdatedBoard = (
  board: TextBoard,
  rowNum: number,
  colNum: number,
  bIsNext: boolean
): TextBoard => {
  // This takes in a game board state and a move
  // and returns an updated board with that move incorporated
  const newBoard = structuredClone(board);
  if (board[rowNum][colNum] != emptyLetter) {
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.");
  }
  newBoard[rowNum][colNum] = bIsNext ? blackLetter : whiteLetter;
  return newBoard;
};

const checkCell = (
  board: TextBoard,
  rowNumber: number,
  colNumber: number
): string => {
  // Lets you check a cell on a board without worrying about
  // whether your coordinates are out of bounds
  if (
    rowNumber < 0 ||
    colNumber < 0 ||
    rowNumber >= board.length ||
    colNumber >= board.length
  ) {
    return outsideLetter;
  } else return board[rowNumber][colNumber];
};

// This approach does NOT work
// Need to either return a board, or just use a function like this to confirm that a tile is valid
const addToCell = (
  board: number[][],
  rowNumber: number,
  colNumber: number,
  operand: number,
  isPositive: boolean
): void => {
  // Lets you add number to a number[][] board without worrying about
  // whether your coordinates are out of bounds
  if (
    rowNumber < 0 ||
    colNumber < 0 ||
    rowNumber >= board.length ||
    colNumber >= board.length
  ) {
    console.log("Yup");
  } else {
    if (isPositive) {
      board[rowNumber][colNumber] += operand;
    } else {
      board[rowNumber][colNumber] -= operand;
    }
  }
};


const neighbourString = (board: TextBoard, i: number, j: number) => {
  // Returns a string of the pieces occupying four neighbouring spaces
  // i is rowNumber, j is colNumber
  const north = checkCell(board, i - 1, j);
  const south = checkCell(board, i + 1, j);
  const west = checkCell(board, i, j - 1);
  const east = checkCell(board, i, j + 1);
  const combined = north + south + east + west;
  return combined;
};

const assessLibertyAcrossBoard = ({
  gameBoard,
  shadowBoard,
  focusOnBlack,
}: {
  gameBoard: TextBoard;
  shadowBoard: TextBoard;
  focusOnBlack: boolean;
}): TextBoard => {
  // After Black moves, we assess White's stones first, and then assess Black's (to assess for suicides)
  // So each time we run this function we focus on a single Player
  // If we're not focusing on the Player, we treat all their pieces as being safe, i.e. "hasLiberty"

  const safeLetter = focusOnBlack ? whiteLetter : blackLetter;

  // This must take in both the gameBoard and the shadowBoard because it is recursive
  // and state of the shadowBoard changes at different levels of recursion

  const newShadowBoard = structuredClone(shadowBoard);

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // Check and skip anything that has already been assessed has having Liberty
      console.log("ij:",i,j)
      if (newShadowBoard[i][j] == "hasLiberty") {
        null;
      }

      // Any empty squares effectively have Liberty
      else if (gameBoard[i][j] == emptyLetter) {
        newShadowBoard[i][j] = "hasLiberty";
      }

      // Every time we run this function one player is treated as "Safe"
      // Let's just pretend here their pieces enjoy liberty
      else if (gameBoard[i][j] == safeLetter) {
        newShadowBoard[i][j] = "hasLiberty";
      }

      // For non-empty spaces, we want to know what lives in the neighouring spaces
      else {
        const neighbours = neighbourString(gameBoard, i, j);

        // If one of those spaces is empty, you have Liberty
        if (neighbours.includes(emptyLetter)) {
          newShadowBoard[i][j] = "hasLiberty";
        }

        // If you're the most recently placed stone
        // If one of those spaces is non-empty, we have two conditions to gain Liberty.
        // Neighbouring space must:
        // 1 - Be of the same colour
        // 2 - Have Liberty

        // Let's check North
        else if (
          checkCell(gameBoard, i - 1, j) === gameBoard[i][j] &&
          checkCell(newShadowBoard, i - 1, j) === "hasLiberty"
        ) {
          newShadowBoard[i][j] = "hasLiberty";
        }
        // Let's check South
        else if (
          checkCell(gameBoard, i + 1, j) === gameBoard[i][j] &&
          checkCell(newShadowBoard, i + 1, j) === "hasLiberty"
        ) {
          newShadowBoard[i][j] = "hasLiberty";
        }
        // Let's check West
        else if (
          checkCell(gameBoard, i, j - 1) === gameBoard[i][j] &&
          checkCell(newShadowBoard, i, j - 1) === "hasLiberty"
        ) {
          newShadowBoard[i][j] = "hasLiberty";
        }
        // Let's check East
        else if (
          checkCell(gameBoard, i, j + 1) === gameBoard[i][j] &&
          checkCell(newShadowBoard, i, j + 1) === "hasLiberty"
        ) {
          newShadowBoard[i][j] = "hasLiberty";
        }
      }
    }
  }
  console.log("Recursive function called: assessLibertyAcrossBoard");
  if (JSON.stringify(shadowBoard) != JSON.stringify(newShadowBoard)) {
    const newNewShadowBoard = assessLibertyAcrossBoard({
      gameBoard: gameBoard,
      shadowBoard: newShadowBoard,
      focusOnBlack: focusOnBlack,
    });
    return newNewShadowBoard;
  } else return newShadowBoard;
};

const removeCapturedStones = ({
  gameBoard,
  shadowBoard,
  gameScore,
  setGameScore,
}: {
  gameBoard: TextBoard;
  shadowBoard: TextBoard;
  gameScore: GameScore;
  setGameScore: Function;
}): TextBoard => {
  const newGameBoard = structuredClone(gameBoard);

  let newCaptivesB2W = 0
  let newCaptivesW2B = 0

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // On shadowBoard, empty string at this stage means we have confirmed they do not have liberties
      if (shadowBoard[i][j] == "") {
        if (gameBoard[i][j] === blackLetter){
          newCaptivesB2W += 1;
          setGameScore({...gameScore, blackStonesLostToWhite:(gameScore.blackStonesLostToWhite+newCaptivesB2W)})
        }
        else if (gameBoard[i][j] === whiteLetter){
          newCaptivesW2B += 1
          setGameScore({...gameScore, whiteStonesLostToBlack:(gameScore.whiteStonesLostToBlack+newCaptivesW2B)})
        }
        newGameBoard[i][j] = emptyLetter;
      }
    }
  }

  // This is where I would expect to place the setGameScore function, but for some reason it causes
  // an infinite re-render loop. M
  // setGameScore({
  //   ...gameScore, 
  //   // blackStonesLostToWhite:(gameScore.blackStonesLostToWhite+newCaptivesB2W),
  //   // whiteStonesLostToBlack:(gameScore.whiteStonesLostToBlack+newCaptivesW2B),
  //  })
  return newGameBoard;
};


const assessInfluenceAcrossBoard = ({
  gameBoard,
  influenceBoard,
  recursionCount = 0,
}: {
  gameBoard: TextBoard;
  influenceBoard: NumberBoard;
  recursionCount: number;
}): NumberBoard => {

  if(recursionCount > 2){
    return influenceBoard
  }
  // We assess influence without reference to whose go it is
  // Function must take in both the gameBoard and the influenceBoard because it is recursive
  // and state of the influenceBoard changes at different levels of recursion

  // TBD - do we need to limit this with a recursion count?

  const newInfluenceBoard = structuredClone(influenceBoard);

  // Algorithm Parameters

  // local means the stone's one tile
  // cardinal means N | S | W | E
  // intercardinal means NW | NE | SW | SE
  // supercardinal (made up word) here means NN | SS | WW | EE

  const localInfluence = 3;

  const cardinalInfluence = 4;
  const intercardinalInfluence = 2;
  const supercardinalInfluence = 1;

  const cardinalDirections = [[1,0],[-1,0],[0,1],[0,-1]]
  const interDirections = [[1,1],[-1,-1],[-1,1],[1,-1]]
  const superDirections = [[2,0],[-2,0],[0,2],[0,-2]]

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // Skip anything that has already hit a maximum influence
      // if (Math.abs(newInfluenceBoard[i][j]) >= maxInfluence){
      //   null
      // }

      // For the influence values:
      // BLACK = POSITIVE INTEGERS
      // WHITE = NEGATIVE INTEGERS

      const isPositive = gameBoard[i][j] === blackLetter;

      // If the tile has a stone on it, assign local, cardinal, inter, super influences
      if (gameBoard[i][j] === blackLetter || gameBoard[i][j] === whiteLetter) {
        addToCell(newInfluenceBoard, i, j, localInfluence, isPositive);

        // Cardinal
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + cardinalDirections[dir][0], j + cardinalDirections[dir][1], cardinalInfluence, isPositive)
        }

        // Intercardinal
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + interDirections[dir][0], j + interDirections[dir][1], intercardinalInfluence, isPositive)
        }

        // Supercardinal
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + superDirections[dir][0], j + superDirections[dir][1], supercardinalInfluence, isPositive)
        }
      }

      // If an empty tile is as strongly influenced as if it had a stone
      // let's give it a soft onward influence
      // Black first
      else if (newInfluenceBoard[i][j] > localInfluence) {

        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + superDirections[dir][0], j + superDirections[dir][1], supercardinalInfluence, true)
        }

        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + interDirections[dir][0], j + interDirections[dir][1], supercardinalInfluence, true)
        }
      }

      // White second
      else if (newInfluenceBoard[i][j] < -localInfluence) {
        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + superDirections[dir][0], j + superDirections[dir][1], supercardinalInfluence, false)
        }

        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(newInfluenceBoard, i + interDirections[dir][0], j + interDirections[dir][1], supercardinalInfluence, false)
        }
      }
    }
  }

  console.log("Recursive function called: assessInfluenceAcrossBoard")
  const newRecursionCount = recursionCount + 1
  if (JSON.stringify(influenceBoard) != JSON.stringify(newInfluenceBoard)) {
    const newNewInfluenceBoard = assessInfluenceAcrossBoard({gameBoard : gameBoard, influenceBoard : newInfluenceBoard, recursionCount: newRecursionCount});
    return newNewInfluenceBoard
  }
  else return newInfluenceBoard

  return newInfluenceBoard;
};

type WinState = {
  outcome: string | null;
  winner: string | null;
};

export const checkWinCondition = (board: TextBoard): WinState => {
  // Enter Win Conditions here
  //
  //
  //
  //
  //
  // return a WinCondition

  const moveCount = board.toString().replace(/,/g, "").length;
  // without the /g global modifier this replace function will default to
  // only swapping out the first instance of the character

  const boardSize = board.length * board.length;
  // square boards only

  if (moveCount >= boardSize) {
    return { outcome: "TIE", winner: null };
  }

  return { outcome: null, winner: null };
};

//// STYLING USED IN NextPlayerMessage AND ShowTile ////

const blackTextClass = "text-black-800";
const blackStoneClass = "bg-zinc-600 rounded-full";

const blackBGColor = "zinc";
const blackTileWeakBG = `bg-${blackBGColor}-100`;
const blackTileMediumBG = `bg-${blackBGColor}-200`;
const blackTileStrongBG = `bg-${blackBGColor}-400`;

const whiteTextClass = "text-stone-300";
const whiteStoneClass = "bg-stone-100 rounded-full";

const whiteBGColor = "lime";
const whiteTileWeakBG = `bg-${whiteBGColor}-100`;
const whiteTileMediumBG = `bg-${whiteBGColor}-200`;
const whiteTileStrongBG = `bg-${whiteBGColor}-400`;

const emptyTileBG = "bg-orange-200";

const NextPlayerMessage = ({ bIsNext }: { bIsNext: boolean }) => {
  const nextPlayer = bIsNext ? blackString : whiteString;
  let className = bIsNext ? blackTextClass : whiteTextClass;
  className = className + " text-2xl font-bold";
  return (
    <div className="p-5">
      <div>Next move is:</div>
      <div className={className}>{nextPlayer}</div>
    </div>
  );
};

const ShowInfluenceToggle = ({ userSettings, setUserSettings }: { userSettings: UserSettings, setUserSettings: Function}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      value={userSettings.showInfluence.toString()}
      className="sr-only peer"
      onChange={() =>
        setUserSettings({
          ...userSettings,
          showInfluence: !userSettings.showInfluence,
        })
      }
    />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      Show influence
    </span>
  </label>
  );
};



const ShowTile = ({
  rowNum,
  colNum,
  board,
  setBoard,
  bIsNext,
  setBIsNext,
  influence,
  userSettings,
}: {
  rowNum: number;
  colNum: number;
  board: TextBoard;
  setBoard: Function;
  bIsNext: boolean;
  setBIsNext: Function;
  influence: NumberBoard;
  userSettings: UserSettings;
}) => {
  // We use the influence to choose the background color of the tile
  let tileBGColor = "";
  const localInfluence = influence[rowNum][colNum];
  if (!userSettings.showInfluence) {
    {
      tileBGColor = emptyTileBG;
    }
  } else if (localInfluence === 0) {
    tileBGColor = emptyTileBG;
  } else if (localInfluence < -4) {
    tileBGColor = whiteTileStrongBG;
  } else if (localInfluence < -2) {
    tileBGColor = whiteTileMediumBG;
  } else if (localInfluence < 0) {
    tileBGColor = whiteTileWeakBG;
  } else if (localInfluence > 4) {
    tileBGColor = blackTileStrongBG;
  } else if (localInfluence > 2) {
    tileBGColor = blackTileMediumBG;
  } else if (localInfluence > 0) {
    tileBGColor = blackTileWeakBG;
  }

  const sharedClassName = `flex flex-col w-10 h-10 rounded-sm m-1 p-2 font-bold ${tileBGColor}`;
  const nullClass = "text-gray-500 cursor-pointer";

  const makeMove = () => {
    setBoard(getUpdatedBoard(board, rowNum, colNum, bIsNext));
    setBIsNext(!bIsNext);
  };

  if (board[rowNum][colNum] === blackLetter) {
    return (
      <div className={sharedClassName + " " + blackTextClass}>
        <div className={blackStoneClass}>&nbsp;
          {/* {blackLetter} */}
          </div>
      </div>
    );
  }
  if (board[rowNum][colNum] === whiteLetter) {
    return (
      <div className={sharedClassName + " " + whiteTextClass}>
        <div className={whiteStoneClass}>&nbsp;
          {/* {whiteLetter} */}
          </div>
      </div>
    );
  } else if (board[rowNum][colNum] === emptyLetter) {
    const showInfluence = (localInfluence != 0 && userSettings.showInfluence);
    const tileDisplay = showInfluence ? localInfluence : "";
    return (
      <a onClick={() => makeMove()}>
        <div className={sharedClassName + " " + nullClass}>{tileDisplay}</div>
      </a>
    );
  } else {
    console.log("ERROR: Tiles detected with irregular values.");
    return <div></div>;
  }
};

const ShowBoard = ({
  board,
  setBoard,
  bIsNext,
  setBIsNext,
  influence,
  userSettings,
}: {
  board: TextBoard;
  setBoard: Function;
  bIsNext: boolean;
  setBIsNext: Function;
  influence: NumberBoard;
  userSettings: UserSettings;
}) => {
  const sharedRowClassName = "flex";

  return (
    <>
      {board.map((rowArray, rowIndex) => {
        return (
          <div className={sharedRowClassName}>
            {rowArray.map(
              // if have a  declared value and you don't intend to ever call it, give it an underscore
              (_cell, colIndex) => (
                <ShowTile
                  rowNum={rowIndex}
                  colNum={colIndex}
                  board={board}
                  setBoard={setBoard}
                  bIsNext={bIsNext}
                  setBIsNext={setBIsNext}
                  influence={influence}
                  userSettings={userSettings}
                />
              )
            )}
          </div>
        );
      })}
    </>
  );
};

const buttonStyling = "p-5";

const PassButton = ({
  bIsNext,
  setBIsNext,
  passCount,
  setPassCount,
}: {
  bIsNext: boolean;
  setBIsNext: Function;
  passCount: number;
  setPassCount: Function;
}) => {
  const onPass = () => {
    setPassCount(passCount + 1);
    setBIsNext(!bIsNext);
  };
  return (
    <div className={buttonStyling}>
      <button onClick={() => onPass()}>Pass</button>
    </div>
  );
};
const RefreshButton = ({
  setBoard,
  setBIsNext,
  setPassCount,
  boardSize,
}: {
  setBoard: Function;
  setBIsNext: Function;
  setPassCount: Function;
  boardSize: number
}) => {
  const refreshBoard = () => {
    setBoard(textBoardGenerator(boardSize, emptyLetter));
    setBIsNext(true);
    setPassCount(0);
  };

  return (
    <div className={buttonStyling}>
      <button onClick={() => refreshBoard()}>Start again</button>
    </div>
  );
};

const ShowScore = ({gameScore} : {gameScore: GameScore}) => {
  return(
    <div>
      Black has captured: {gameScore.whiteStonesLostToBlack} stones
      <br />
      White has captured: {gameScore.blackStonesLostToWhite} stones
    </div>
  )
}

const ShowResults = ({
  outcome,
  winner,
}: {
  outcome: string | null;
  winner: string | null;
}) => {
  if (outcome === "WIN") {
    return (
      <div>
        The winner is {winner}
        <br />
        Congratulations!
      </div>
    );
  } else if (outcome === "TIE") {
    return <div>The game is TIED! No winner today.</div>;
  } else return null;
};

export type UserSettings = {
  showInfluence: boolean
  boardSize: "Small" | "Medium" | "Large"
  dropDownHidden: boolean
  prodBoardLength: number
}

type GameScore = {
  blackStonesLostToWhite: number
  whiteStonesLostToBlack: number
}

function App() {
  console.log("==== APP REFRESH ====");

  const [userSettings, setUserSettings] = useState<UserSettings>({
    showInfluence: false,
    boardSize: "Medium",
    dropDownHidden: true,
    prodBoardLength: 13,
  });


  const boardLengthDict = {
    Small: 9,
    Medium: 13,
    Large: 19,
    // Any new values here will also need to be added to UserSettings type
  }

  console.log(boardLengthDict[userSettings.boardSize])

  useEffect(()=>{
      setBoard(textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter));
      setBIsNext(true);
      setPassCount(0);
    console.log('board size changed!')
  },[userSettings.boardSize])

  const [board, setBoard] = useState(structuredClone(textBoardGenerator(userSettings.prodBoardLength, emptyLetter)));
  const [bIsNext, setBIsNext] = useState(true);
  const [passCount, setPassCount] = useState(0);
  const [gameScore, setGameScore] = useState<GameScore>({
    blackStonesLostToWhite: 0,
    whiteStonesLostToBlack: 0
  })

  // We don't need to run our heavy algos if a user has just passed
  if (passCount === 0) {
    // We run this once where we treat the player who just moved as "Safe"
    const freshShadowBoard = assessLibertyAcrossBoard({
      gameBoard: board,
      shadowBoard: textBoardGenerator(userSettings.prodBoardLength, ""),
      focusOnBlack: bIsNext,
    });
    const freshGameBoard = removeCapturedStones({
      gameBoard: board,
      shadowBoard: freshShadowBoard,
      gameScore: gameScore,
      setGameScore: setGameScore,
    });

    // Then we run it again to assess for suicides
    const freshShadowBoard2 = assessLibertyAcrossBoard({
      gameBoard: freshGameBoard,
      shadowBoard: textBoardGenerator(userSettings.prodBoardLength, ""),
      focusOnBlack: !bIsNext,
    });
    const freshGameBoard2 = removeCapturedStones({
      gameBoard: freshGameBoard,
      shadowBoard: freshShadowBoard2,
      gameScore: gameScore,
      setGameScore: setGameScore,
    });

    if (JSON.stringify(board) != JSON.stringify(freshGameBoard2)) {
      console.log("Stone(s) have been captured.");
      setBoard(freshGameBoard2);
    }
  }

  let currentWinState = checkWinCondition(board);

  if (passCount > 1) {
    currentWinState = {
      // dummy date for now
      outcome: "WIN",
      winner: blackString,
    };
  }

  const influence = assessInfluenceAcrossBoard({
    gameBoard: board,
    influenceBoard: numberBoardGenerator(userSettings.prodBoardLength, 0),
  });
  console.log(influence);

  return (
    <>
      <NextPlayerMessage bIsNext={bIsNext} />

      <ShowInfluenceToggle 
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <br />
      <SizeDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />


      <ShowScore gameScore={gameScore}/>

      <ShowBoard
        board={board}
        setBoard={setBoard}
        bIsNext={bIsNext}
        setBIsNext={setBIsNext}
        influence={influence}
        userSettings={userSettings}
      />

      <PassButton
        bIsNext={bIsNext}
        setBIsNext={setBIsNext}
        passCount={passCount}
        setPassCount={setPassCount}
      />

      <RefreshButton
        setBoard={setBoard}
        setBIsNext={setBIsNext}
        setPassCount={setPassCount}
        boardSize={userSettings.prodBoardLength}
      />

      <ShowResults
        outcome={currentWinState.outcome}
        winner={currentWinState.winner}
      />

    </>
  );
}

export default App;

//
// COMING UP NEXT
//
// Replace the boardsizenumber with boardLengthDict[userSettings.boardSize]
// Count captured pieces somewhere
// End of game scoring
// Display captured pieces on sides
// NPC opponent
// Make NPC optional
// Let user choose colours
// Ko
// Snazzy alert when Atari happens
// Toggle for
//
