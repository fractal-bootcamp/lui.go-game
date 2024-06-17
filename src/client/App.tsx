import { useEffect, useState } from "react";

import { SettingDropdown } from "../client/Dropdown"

import { assessInfluence } from "../shared/BoardAssessors"

import {
 useBoardController
} from "../shared/useBoardController"


import "./App.css";


import {
  blackString,
  whiteString,
  blackLetter,
  whiteLetter,
  emptyLetter,
  UserSettings,
  Game,
  GameScore,
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


const fetchTileBgColor = (localInfluence: number) => {

  let tileBGColor = ""

  if (localInfluence === 0) {
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

  return tileBGColor
}



const ShowTile = ({
  game,
  playMove,
  rowNum,
  colNum,
  influence,
  userSettings,
}: {
  game: Game;
  playMove: Function;
  rowNum: number;
  colNum: number;
  influence: number[][];
  userSettings: UserSettings;
}) => {

  // We use the influence to choose the background color of the tile
  const localInfluence = influence[rowNum][colNum];
  const showInfluence = userSettings.showInfluence
  const tileBGColor = showInfluence ? fetchTileBgColor(localInfluence) : emptyTileBG
  const sharedClassName = `flex flex-col w-10 h-10 rounded-sm m-1 p-2 font-bold ${tileBGColor}`;
  const nullClass = "text-gray-500 cursor-pointer";

  if (game.board[rowNum][colNum] === blackLetter) {
    return (
      <div className={sharedClassName + " " + blackTextClass}>
        <div className={blackStoneClass}>&nbsp;
          {/* {blackLetter} */}
          </div>
      </div>
    );
  }
  if (game.board[rowNum][colNum] === whiteLetter) {
    return (
      <div className={sharedClassName + " " + whiteTextClass}>
        <div className={whiteStoneClass}>&nbsp;
          {/* {whiteLetter} */}
          </div>
      </div>
    );
  } else if (game.board[rowNum][colNum] === emptyLetter) {
    const tileDisplay = showInfluence ? localInfluence : "";
    return (
      <a onClick={() => playMove(game, rowNum, colNum)}>
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
  playMove,
  influence,
  userSettings,
}: {
  game: Game;
  playMove: Function;
  influence: number[][];
  userSettings: UserSettings;
}) => {
  const sharedRowClassName = "flex";

  return (
    <>
      {game.board.map((rowArray, rowIndex) => {
        return (
          <div className={sharedRowClassName}>
            {rowArray.map(
              // if have a  declared value and you don't intend to ever call it, give it an underscore
              (_cell, colIndex) => (
                <ShowTile
                  game={game}
                  playMove={playMove}
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




function App() {
  console.log("==== APP REFRESH ====");

  const [userSettings, setUserSettings] = useState<UserSettings>({
    showInfluence: false,
    boardSize: "Small",
    playMode: "Solo",
    dropDownHidden: true,
    singlePlayer: true
  });
 
  // If you switch between solo and server play mode, we
  // want to use custom hooks to redefine our four core
  // game actions

  const {activeGame, getGame, playMove, resetGame, passMove} = useBoardController(userSettings.playMode)

   // If you have taken a move in local mode, we want to remove captured stones
   useEffect(()=> {
    console.log("change detected")
    console.log(activeGame)
    console.log(getGame)
    console.log(playMove)
    console.log(resetGame)
    console.log(passMove)
    },[activeGame, getGame, playMove, resetGame, passMove])
  

  // Game               -> getGame          -> Game
  // Game, row, col     -> playMove         -> Game
  // Game               -> resetGame        -> Game
  // Game               -> passMove         -> Game



  // // REMOVING BOARD SIZE CHANGE TO SIMPLIFY MULTIPLAYER
  // // If you change the board size, we want a fresh board
  // useEffect(()=> {
  //   const freshBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
  //   setActiveGame({...activeGame, board: freshBoard, bIsNext: true})
  // },[userSettings.boardSize])


  // If you have taken a move in local mode, we want to remove captured stones
  useEffect(()=> {
    getGame(activeGame)
    },[activeGame.moveCount])

  const influence = assessInfluence(activeGame);

  return (
    <>
      <NextPlayerMessage bIsNext={activeGame.bIsNext} />

      <ShowInfluenceToggle 
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <br />

      <ShowScore gameScore={activeGame.gameScore}/>

      <ShowBoard
        game={activeGame}
        playMove = {playMove}
        influence={influence}
        userSettings={userSettings}
        key={userSettings.playMode}
      />

      <ActionButton
        text="Pass"
        action={()=>passMove(activeGame)}
      />

      <SettingDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        settingKey="playMode"
        settingOptions={["Solo", "Online"]}
      />

      <br />
      <br />

      {/* <SettingDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        settingKey="boardSize"
        settingOptions={["Small", "Medium", "Large"]}
      /> */}

      <ActionButton text= "Start again" action={() => resetGame(activeGame)} />

      <ShowResults
        outcome={activeGame.winState.outcome}
        winner={activeGame.winState.winner}
      />

    </>
  );
}

export default App;

//
// COMING UP NEXT
//
// DONE Get rid of setBoard etc
// DONE pull setGame out of the Updater.ts functions
// DONE Reusable DropDown
// DONE Add Multiplayer option to UserSettings
// DONE Start passing Game object that includes board, rather than smaller object
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
