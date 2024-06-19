import { useEffect, useState } from "react";

import { SettingDropdown } from "./SettingDropdown";

import { assessInfluence } from "../shared/BoardAssessors";

import { useBoardController } from "../shared/useBoardController";

import { AnimatePresence, motion } from "framer-motion";

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
} from "../shared/constants";

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

const ShowInfluenceToggle = ({
  userSettings,
  setUserSettings,
}: {
  userSettings: UserSettings;
  setUserSettings: Function;
}) => {
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
  let tileBGColor = "";

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

  return tileBGColor;
};

const ShowStone = ({
  colourLetter,
  rowNum,
  colNum,
}: {
  colourLetter: string;
  rowNum: number;
  colNum: number;
}) => {
  const className =
    colourLetter === blackLetter ? blackStoneClass : whiteStoneClass;

  const selfStoneAnimation = {
    initial: { x: 100, y: 300, opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { x: -100, y: -300, opacity: 0 },
  };

  const opponentStoneAnimation = {
    initial: { x: -100, y: -300, opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { x: 100, y: 300, opacity: 0 },
  };

  const stoneAnimation =
    colourLetter === blackLetter ? selfStoneAnimation : opponentStoneAnimation;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={className}
          key={`${rowNum}-${colNum}`}
          {...stoneAnimation}
        >
          &nbsp;
          {/* {blackLetter} */}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

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
  const showInfluence = userSettings.showInfluence;
  const tileBGColor = showInfluence
    ? fetchTileBgColor(localInfluence)
    : emptyTileBG;
  const sharedClassName = `flex flex-col w-10 h-10 rounded-sm m-1 p-2 font-bold ${tileBGColor}`;
  const nullClass = "text-gray-500 cursor-pointer";

  const tokenAtPosition = game.board[rowNum][colNum];

  if ([blackLetter, whiteLetter].includes(tokenAtPosition)) {
    // This is a lambda function. It returns a configuration
    // and can be pulled out into its own function at some stage
    const { tokenClass, letter } = (() => {
      if (tokenAtPosition === blackLetter) {
        return {
          tokenClass: blackTextClass,
          letter: blackLetter,
        };
      }
      return {
        tokenClass: whiteTextClass,
        letter: whiteLetter,
      };
    })();
    return (
      <div className={sharedClassName + " " + tokenClass}>
        <ShowStone colourLetter={letter} rowNum={rowNum} colNum={colNum} />
      </div>
    );
  } else if (game.board[rowNum][colNum] === emptyLetter) {
    const tileDisplay = showInfluence ? localInfluence : "";
    const rotationNumber = (rowNum + colNum) % 2 === 1 ? -2 : 2;
    return (
      <a onClick={() => playMove(game, rowNum, colNum)}>
        <motion.div
          className={sharedClassName + " " + nullClass}
          whileHover={{ rotate: rotationNumber, scale: 1.1 }}
          whileTap={{ rotate: -rotationNumber, scale: 0.85 }}
        >
          {tileDisplay}
        </motion.div>
      </a>
    );
  } else {
    console.log("ERROR: Tiles detected with irregular values.");
    return <div />;
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

const ActionButton = ({ text, action }: { text: string; action: Function }) => {
  return (
    <div className={buttonStyling}>
      <motion.button
        onClick={() => action()}
        whileHover={{ rotate: -5, scale: 1.1 }}
        whileTap={{ rotate: 5, scale: 0.9 }}
      >
        {text}
      </motion.button>
    </div>
  );
};

const ShowScore = ({ gameScore }: { gameScore: GameScore }) => {
  return (
    <div>
      Black has captured: {gameScore.whiteStonesLostToBlack} stones
      <br />
      White has captured: {gameScore.blackStonesLostToWhite} stones
    </div>
  );
};

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
    singlePlayer: true,
  });

  // If you switch between solo and server play mode, we
  // want to use custom hooks to redefine our four core
  // game actions

  const { activeGame, syncGame, playMove, resetGame, passMove } =
    useBoardController(userSettings.playMode);

  // If you have taken a move in local mode, we want to remove captured stones
  useEffect(() => {
    console.log("change detected");
  }, [activeGame, syncGame, playMove, resetGame, passMove]);

  // Game               -> getGame          -> Game
  // Game, row, col     -> playMove         -> Game
  // Game               -> resetGame        -> Game
  // Game               -> passMove         -> Game

  const [poller, setPoller] = useState<number>(0);

  useEffect(() => {
    syncGame(activeGame);
    setTimeout(() => {
      setPoller(poller + 1);
    }, 800);
  }, [poller]);
  // // REMOVING BOARD SIZE CHANGE TO SIMPLIFY MULTIPLAYER
  // // If you change the board size, we want a fresh board
  // useEffect(()=> {
  //   const freshBoard = textBoardGenerator(boardLengthDict[userSettings.boardSize], emptyLetter)
  //   setActiveGame({...activeGame, board: freshBoard, bIsNext: true})
  // },[userSettings.boardSize])

  // If you have taken a move in local mode, we want to remove captured stones
  useEffect(() => {
    syncGame(activeGame);
  }, [activeGame.moveCount]);

  const influence = assessInfluence(activeGame);

  return (
    <>
      <NextPlayerMessage bIsNext={activeGame.bIsNext} />

      <ShowInfluenceToggle
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <br />

      <ShowScore gameScore={activeGame.gameScore} />

      <ShowBoard
        game={activeGame}
        playMove={playMove}
        influence={influence}
        userSettings={userSettings}
        key={userSettings.playMode}
      />

      <ActionButton text="Pass" action={() => passMove(activeGame)} />

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

      <ActionButton text="Start again" action={() => resetGame(activeGame)} />

      <ShowResults
        outcome={activeGame.winState.outcome}
        winner={activeGame.winState.winner}
      />
    </>
  );
}

export default App;

//
// DONE DONE DONE DONE
// Get rid of setBoard etc
// pull setGame out of the Updater.ts functions
// Reusable DropDown
// Add Multiplayer option to UserSettings
// Start passing Game object that includes board, rather than smaller object
// Enable user to switch between modes
// Replace the boardsizenumber with boardLengthDict[userSettings.boardSize]
// Count captured pieces somewhere
//
// COMING UP NEXT
// Add animation to captured tiles
// Move Game mode dropdown to top of page as an elegant toggle
// Only show size dropdown for solo mode
// Enable Online player to create a new shareable game
// Enable Online player only claim a side, and only play that side
// Fix the Influence algorithm so that it's rotationally balanced (assessments need to be made off older version of influence board)
// Fix the Influence display option so it's not gross
// Add in basic Win Condition check (full board)
// Display captured pieces on sides
// NPC opponent on Solo Mode
// Make NPC optional
// Let user choose colours
// Ko
// Snazzy alert when Atari happens
// Toggle for
//
