import { useEffect, useState } from "react";

import { SizeDropdown } from "./DropDown";

import {
  checkWinCondition,
  assessLibertyAcrossBoard,
  assessInfluenceAcrossBoard
} from "../shared/BoardAssessors"

import {
  addNewStone,
  removeCapturedStones,
} from "../shared/BoardUpdaters"


import "./App.css";

import {
  numberBoardGenerator,
  textBoardGenerator,
} from "./ArrayGenerator";

import {
  blackString,
  whiteString,
  blackLetter,
  whiteLetter,
  emptyLetter,
  boardLengthDict,
  GameScore
} from "../shared/constants"



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
  board: string[][];
  setBoard: Function;
  bIsNext: boolean;
  setBIsNext: Function;
  influence: number[][];
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
    setBoard(addNewStone(board, rowNum, colNum, bIsNext));
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
  board: string[][];
  setBoard: Function;
  bIsNext: boolean;
  setBIsNext: Function;
  influence: number[][];
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
  singlePlayer: boolean
}





function App() {
  console.log("==== APP REFRESH ====");

  const [userSettings, setUserSettings] = useState<UserSettings>({
    showInfluence: false,
    boardSize: "Small",
    dropDownHidden: true,
    singlePlayer: true
  });
 
  useEffect(()=> {
    setBoard(textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter))
    setBIsNext(true);
  },[userSettings.boardSize])

  const [board, setBoard] = useState(structuredClone(textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)));
  const [bIsNext, setBIsNext] = useState(true);
  const [passCount, setPassCount] = useState(0);
  const [gameScore, setGameScore] = useState<GameScore>({
    blackStonesLostToWhite: 0,
    whiteStonesLostToBlack: 0
  })

  // We don't need to run our heavy algos if a user has just passed
  if (passCount === 0) {
    // We run this once where we treat the player who just moved as "Safe"
    const freshLibertyBoard = assessLibertyAcrossBoard({
      gameBoard: board,
      libertyBoard: textBoardGenerator(boardLengthDict[userSettings.boardSize], ""),
      focusOnBlack: bIsNext,
    });
    const freshGameBoard = removeCapturedStones({
      gameBoard: board,
      libertyBoard: freshLibertyBoard,
      gameScore: gameScore,
      setGameScore: setGameScore,
    });

    // Then we run it again to assess for suicides
    const freshLibertyBoard2 = assessLibertyAcrossBoard({
      gameBoard: freshGameBoard,
      libertyBoard: textBoardGenerator(boardLengthDict[userSettings.boardSize], ""),
      focusOnBlack: !bIsNext,
    });
    const freshGameBoard2 = removeCapturedStones({
      gameBoard: freshGameBoard,
      libertyBoard: freshLibertyBoard2,
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

  // size of influence board in this function is pegged to the version of board in State
  // because State sometimes lags slightly behind
  const influence = assessInfluenceAcrossBoard({
    gameBoard: board,
    influenceBoard: numberBoardGenerator(board.length, 0),
    recursionCount: 0,
  });

  return (
    <>
      <NextPlayerMessage bIsNext={bIsNext} />

      <ShowInfluenceToggle 
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <br />

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
      <SizeDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />

      <RefreshButton
        setBoard={setBoard}
        setBIsNext={setBIsNext}
        setPassCount={setPassCount}
        boardSize={boardLengthDict[userSettings.boardSize]}
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
// Fix the Influence algorithm so that it's rotationally balanced (assessments need to be made off older version of influence board)
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
