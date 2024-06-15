import { useEffect, useState } from "react";

import { SettingDropdown } from "../client/Dropdown"

import {
  assessInfluenceAcrossBoard as assessInfluence
} from "../shared/BoardAssessors"

import {
  addNewStone,
  removeCapturedStones as removeCapturedStones,
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
  UserSettings,
  Game,
  GameScore,
  exampleGame
} from "../shared/constants"


import {
  getGame,
  voluntaryPassServer,
  refreshBoardServer,
  onTileClickServer as sendMoveToServer,
} from "../client/ServerCalls"


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
  const localInfluence = influence[rowNum][colNum];
  const showInfluence = userSettings.showInfluence
  const tileBGColor = showInfluence ? fetchTileBgColor(localInfluence) : emptyTileBG
  const sharedClassName = `flex flex-col w-10 h-10 rounded-sm m-1 p-2 font-bold ${tileBGColor}`;
  const nullClass = "text-gray-500 cursor-pointer";

  const onTileClickSolo = () => {
    const updatedGame = addNewStone(game, rowNum, colNum)
    setGame(updatedGame)
  };

  const onTileClickServer = () => {
    sendMoveToServer(game.id, rowNum, colNum).then(res => setGame(res))


    // sendMoveToServer(game.id, rowNum, colNum).then(res => console.log("THIS IS THE RESPONSE,", res))

    // setGame(updatedGame)

    // I WONDER COULD WE TRY SOMETHING LIKE...
    // const updatedGame = onTileClickServer(game.id, rowNum, colNum)
    // setGame(updatedGame)
  };

  const onTileClick = (userSettings.playMode === "Solo") ? onTileClickSolo : onTileClickServer


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
      <a onClick={() => onTileClick()}>
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
      {game.board.map((rowArray, rowIndex) => {
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






function App() {
  console.log("==== APP REFRESH ====");

  const [userSettings, setUserSettings] = useState<UserSettings>({
    showInfluence: false,
    boardSize: "Small",
    playMode: "Solo",
    dropDownHidden: true,
    singlePlayer: true
  });
 
  const [soloGame, setSoloGame] = useState<Game>(structuredClone(exampleGame))
  const [serverGame, setServerGame] = useState<Game>(structuredClone(exampleGame))

  const [activeGame, setActiveGame] = useState<Game>(soloGame)
  const [functionToSetActiveGame, setFunctionToSetActiveGame] = useState<Function>(setSoloGame)

  // If you switch between solo and server play mode, we
  // want to redefine which game is the Active Game
  useEffect(()=> {
    if(userSettings.playMode === "Solo"){
      setActiveGame(soloGame)
      setFunctionToSetActiveGame(setSoloGame)
    }
    else {
      setActiveGame(serverGame)
      setFunctionToSetActiveGame(setServerGame)
    }
    console.log("playMode", userSettings)
  },[userSettings.playMode])

  // If playing online, we need to fetch the game state...
  useEffect(() => {
    const initializeGame = async () => {
      if(userSettings.playMode != "Solo"){
        const data = await getGame("online-game-1");
        // ...and store the game in state
        setActiveGame(data.game)
        console.log("GAME HAS BEEN SET")
        console.log("NEW GAME DETAILS", activeGame.board)
      }
      else{
        console.log("initializeGame called but game is in Solo Mode")
      }
    }
    // call the function
    initializeGame();
    // polling
    // setTimeout(() => {
    //   setPoller(poller + 1);
    // }, 1000);
  }, [activeGame.moveCount]); // We could possible change this to serverGame.moveCount

  // If you change the board size, we want a fresh board
  useEffect(()=> {
    const freshBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
    setActiveGame({...activeGame, board: freshBoard, bIsNext: true})
  },[userSettings.boardSize])


  // If you have taken a move in local mode, we want to remove captured stones
  useEffect(()=> {
    const updatedGame = removeCapturedStones(activeGame)
    setActiveGame(updatedGame)
    },[activeGame.moveCount])



  // size of influence board in this function is pegged to the version of board in State
  // because State sometimes lags slightly behind
  const influence = assessInfluence(activeGame.board);

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
        setGame={setActiveGame}
        influence={influence}
        userSettings={userSettings}
      />

      <ActionButton
        text="Pass"
        action={()=>voluntaryPass(activeGame, setActiveGame)}
      />

      <SettingDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        settingKey="playMode"
        settingOptions={["Solo", "Online"]}
      />

      <br />
      <br />

      <SettingDropdown
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        settingKey="boardSize"
        settingOptions={["Small", "Medium", "Large"]}
      />

      <ActionButton text= "Start again" action={() => refreshBoard(activeGame, setActiveGame, userSettings)} />

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
