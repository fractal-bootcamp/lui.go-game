import {
  blackLetter,
  whiteLetter,
  emptyLetter,
  outsideLetter,
  WinState,
} from "./constants";

const checkCell = (
  board: string[][],
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
  } else {
    if (isPositive) {
      board[rowNumber][colNumber] += operand;
    } else {
      board[rowNumber][colNumber] -= operand;
    }
  }
};

const neighbourString = (board: string[][], i: number, j: number) => {
  // Returns a string of the pieces occupying four neighbouring spaces
  // i is rowNumber, j is colNumber
  const north = checkCell(board, i - 1, j);
  const south = checkCell(board, i + 1, j);
  const west = checkCell(board, i, j - 1);
  const east = checkCell(board, i, j + 1);
  const combined = north + south + east + west;
  return combined;
};

export const assessLibertyAcrossBoard = ({
  gameBoard,
  libertyBoard,
  focusOnBlack,
}: {
  gameBoard: string[][];
  libertyBoard: string[][];
  focusOnBlack: boolean;
}): string[][] => {
  console.log("assessLibertyAcrossBoard");
  // After Black moves, we assess White's stones first, and then assess Black's (to assess for suicides)
  // So each time we run this function we focus on a single Player
  // If we're not focusing on the Player, we treat all their pieces as being safe, i.e. "hasLiberty"

  const safeLetter = focusOnBlack ? whiteLetter : blackLetter;

  // This must take in both the gameBoard and the libertyBoard because it is recursive
  // and state of the libertyBoard changes at different levels of recursion

  const newLibertyBoard = structuredClone(libertyBoard);

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // Check and skip anything that has already been assessed has having Liberty
      console.log("ij:", i, j);
      if (newLibertyBoard[i][j] == "hasLiberty") {
        null;
      }

      // Any empty squares effectively have Liberty
      else if (gameBoard[i][j] == emptyLetter) {
        newLibertyBoard[i][j] = "hasLiberty";
      }

      // Every time we run this function one player is treated as "Safe"
      // Let's just pretend here their pieces enjoy liberty
      else if (gameBoard[i][j] == safeLetter) {
        newLibertyBoard[i][j] = "hasLiberty";
      }

      // For non-empty spaces, we want to know what lives in the neighouring spaces
      else {
        const neighbours = neighbourString(gameBoard, i, j);

        // If one of those spaces is empty, you have Liberty
        if (neighbours.includes(emptyLetter)) {
          newLibertyBoard[i][j] = "hasLiberty";
        }

        // If you're the most recently placed stone
        // If one of those spaces is non-empty, we have two conditions to gain Liberty.
        // Neighbouring space must:
        // 1 - Be of the same colour
        // 2 - Have Liberty

        // Let's check North
        else if (
          checkCell(gameBoard, i - 1, j) === gameBoard[i][j] &&
          checkCell(newLibertyBoard, i - 1, j) === "hasLiberty"
        ) {
          newLibertyBoard[i][j] = "hasLiberty";
        }
        // Let's check South
        else if (
          checkCell(gameBoard, i + 1, j) === gameBoard[i][j] &&
          checkCell(newLibertyBoard, i + 1, j) === "hasLiberty"
        ) {
          newLibertyBoard[i][j] = "hasLiberty";
        }
        // Let's check West
        else if (
          checkCell(gameBoard, i, j - 1) === gameBoard[i][j] &&
          checkCell(newLibertyBoard, i, j - 1) === "hasLiberty"
        ) {
          newLibertyBoard[i][j] = "hasLiberty";
        }
        // Let's check East
        else if (
          checkCell(gameBoard, i, j + 1) === gameBoard[i][j] &&
          checkCell(newLibertyBoard, i, j + 1) === "hasLiberty"
        ) {
          newLibertyBoard[i][j] = "hasLiberty";
        }
      }
    }
  }
  if (JSON.stringify(libertyBoard) != JSON.stringify(newLibertyBoard)) {
    const newNewLibertyBoard = assessLibertyAcrossBoard({
      gameBoard: gameBoard,
      libertyBoard: newLibertyBoard,
      focusOnBlack: focusOnBlack,
    });
    return newNewLibertyBoard;
  } else return newLibertyBoard;
};

export const assessInfluenceAcrossBoard = ({
  gameBoard,
  influenceBoard,
  recursionCount = 0,
}: {
  gameBoard: string[][];
  influenceBoard: number[][];
  recursionCount: number;
}): number[][] => {
  if (gameBoard.length != influenceBoard.length) {
    return influenceBoard;
  }
  if (recursionCount > 2) {
    return influenceBoard;
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

  const cardinalDirections = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const interDirections = [
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ];
  const superDirections = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2],
  ];

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
          addToCell(
            newInfluenceBoard,
            i + cardinalDirections[dir][0],
            j + cardinalDirections[dir][1],
            cardinalInfluence,
            isPositive
          );
        }

        // Intercardinal
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + interDirections[dir][0],
            j + interDirections[dir][1],
            intercardinalInfluence,
            isPositive
          );
        }

        // Supercardinal
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + superDirections[dir][0],
            j + superDirections[dir][1],
            supercardinalInfluence,
            isPositive
          );
        }
      }

      // If an empty tile is as strongly influenced as if it had a stone
      // let's give it a soft onward influence
      // Black first
      else if (newInfluenceBoard[i][j] > localInfluence) {
        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + superDirections[dir][0],
            j + superDirections[dir][1],
            supercardinalInfluence,
            true
          );
        }

        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + interDirections[dir][0],
            j + interDirections[dir][1],
            supercardinalInfluence,
            true
          );
        }
      }

      // White second
      else if (newInfluenceBoard[i][j] < -localInfluence) {
        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + superDirections[dir][0],
            j + superDirections[dir][1],
            supercardinalInfluence,
            false
          );
        }

        // do this on intercardinal squares as well
        for (let dir = 0; dir < 4; dir++) {
          addToCell(
            newInfluenceBoard,
            i + interDirections[dir][0],
            j + interDirections[dir][1],
            supercardinalInfluence,
            false
          );
        }
      }
    }
  }

  console.log("Recursive function called: assessInfluenceAcrossBoard");
  const newRecursionCount = recursionCount + 1;
  if (JSON.stringify(influenceBoard) != JSON.stringify(newInfluenceBoard)) {
    const newNewInfluenceBoard = assessInfluenceAcrossBoard({
      gameBoard: gameBoard,
      influenceBoard: newInfluenceBoard,
      recursionCount: newRecursionCount,
    });
    return newNewInfluenceBoard;
  } else return newInfluenceBoard;

  return newInfluenceBoard;
};

export const checkWinCondition = (board: string[][]): WinState => {
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