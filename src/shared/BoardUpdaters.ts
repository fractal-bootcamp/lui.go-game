import {
  blackLetter,
  whiteLetter,
  emptyLetter,
  GameScore,
} from "../shared/constants";

export const addNewStone = (
  board: string[][],
  rowNum: number,
  colNum: number,
  bIsNext: boolean
): string[][] => {
  // This takes in a game board state and a move
  // and returns an updated board with that move incorporated
  const newBoard = structuredClone(board);
  if (board[rowNum][colNum] != emptyLetter) {
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.");
  }
  newBoard[rowNum][colNum] = bIsNext ? blackLetter : whiteLetter;
  return newBoard;
};

export const removeCapturedStones = ({
  gameBoard,
  libertyBoard,
  gameScore,
  setGameScore,
}: {
  gameBoard: string[][];
  libertyBoard: string[][];
  gameScore: GameScore;
  setGameScore: Function;
}): string[][] => {
  const newGameBoard = structuredClone(gameBoard);

  let newCaptivesB2W = 0;
  let newCaptivesW2B = 0;

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // On libertyBoard, empty string at this stage means we have confirmed they do not have liberties
      if (libertyBoard[i][j] == "") {
        if (gameBoard[i][j] === blackLetter) {
          newCaptivesB2W += 1;
          setGameScore({
            ...gameScore,
            blackStonesLostToWhite:
              gameScore.blackStonesLostToWhite + newCaptivesB2W,
          });
        } else if (gameBoard[i][j] === whiteLetter) {
          newCaptivesW2B += 1;
          setGameScore({
            ...gameScore,
            whiteStonesLostToBlack:
              gameScore.whiteStonesLostToBlack + newCaptivesW2B,
          });
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
