import { useEffect, useState } from "react";

import { SizeDropdown } from "./DropDown";

import {
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
} from "../shared/ArrayGenerator";

import {
  blackString,
  whiteString,
  blackLetter,
  whiteLetter,
  emptyLetter,
  boardLengthDict,
  Game,
  GameScore,
  exampleGame
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
  game,
  setGame,
  rowNum,
  colNum,
  influence,
  userSettings,
}: {
  game: Game;
  setGame: Function;
  rowNum: number;
  colNum: number;
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

  const board = game.gameBoard
  const bIsNext = game.bIsNext

  const makeMove = () => {
    const newBoard = addNewStone(board, rowNum, colNum, bIsNext)

    setGame({...game, gameBoard: newBoard, bIsNext: !bIsNext})
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
  game,
  setGame,
  influence,
  userSettings,
}: {
  game: Game;
  setGame: Function;
  influence: number[][];
  userSettings: UserSettings;
}) => {
  const sharedRowClassName = "flex";

  return (
    <>
      {game.gameBoard.map((rowArray, rowIndex) => {
        return (
          <div className={sharedRowClassName}>
            {rowArray.map(
              // if have a  declared value and you don't intend to ever call it, give it an underscore
              (_cell, colIndex) => (
                <ShowTile
                  game={game}
                  setGame={setGame}
                  rowNum={rowIndex}
                  colNum={colIndex}
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


const refreshBoard = ( game: Game, setGame: Function, userSettings: UserSettings ) => {
  const newBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
  setGame({...game, gameBoard: newBoard, bIsNext: true, passCount: 0 })
}

const voluntaryPass = ( game: Game, setGame: Function ) => {
  setGame({...game, bIsNext: !game.bIsNext, passCount: game.passCount+1})
}


const ActionButton = ({ text, action } : { text: string, action : Function } ) => {
  return (
    <div className={buttonStyling}>
      <button onClick={() => action()}>{text}</button>
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
 
  const [soloGame, setSoloGame] = useState<Game>(structuredClone(exampleGame))

  console.log("passcount on reload", soloGame.passCount)

  useEffect(()=> {
    const freshBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
    setSoloGame({...soloGame, gameBoard: freshBoard, bIsNext: true})

  },[userSettings.boardSize])





  useEffect(()=> {
    console.log("removing")
    removeCapturedStones(soloGame,()=>{})

    // const updatedGame = removeCapturedStones(soloGame)
    // setSoloGame(updatedGame)

    },[soloGame.gameBoard])


  
  // let currentWinState = checkWinCondition(board);

  // if (passCount > 1) {
  //   currentWinState = {
  //     // dummy date for now
  //     outcome: "WIN",
  //     winner: blackString,
  //   };
  // }

  // size of influence board in this function is pegged to the version of board in State
  // because State sometimes lags slightly behind
  const influence = assessInfluenceAcrossBoard({
    gameBoard: soloGame.gameBoard,
    influenceBoard: numberBoardGenerator(soloGame.gameBoard.length, 0),
    recursionCount: 0,
  });

  return (
    <>
      <NextPlayerMessage bIsNext={soloGame.bIsNext} />

      <ShowInfluenceToggle 
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <br />

      <ShowScore gameScore={soloGame.gameScore}/>

      <ShowBoard
        game={soloGame}
        setGame={setSoloGame}
        influence={influence}
        userSettings={userSettings}
      />

      <ActionButton
        text="Pass"
        action={()=>voluntaryPass(soloGame, setSoloGame)}
      />

      <SizeDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        settingKey="boardSize"
        settingOptions={["Small", "Medium", "Large"]}
      />

      <ActionButton text= "Start again" action={() => refreshBoard(soloGame, setSoloGame, userSettings)} />

      {/* <ShowResults
        outcome={currentWinState.outcome}
        winner={currentWinState.winner}
      /> */}

    </>
  );
}

export default App;

//
// COMING UP NEXT
//
// Get rid of setBoard etc
// pull setGame out of the Updater.ts functions
// Reusable DropDown
// Add Multiplayer option to UserSettings
// Start passing Game object that includes board, rather than smaller object
// Enable user to enter a 
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
