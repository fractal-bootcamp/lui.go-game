import { useState } from 'react'

import './App.css'
import { arrayGenerator } from './components/ArrayGenerator';

const boardLength = 4
const startingBoard = arrayGenerator(boardLength)

const blackLetter = "B"
const whiteLetter = "W"
const outsideLetter = "X"
const libertyLetter = "L"

type BoardType = string[][]

const getUpdatedBoard = (board: BoardType, rowNum: number, colNum: number, bIsNext: boolean) => {
  const newBoard = structuredClone(board)  
  if (board[rowNum][colNum] != ""){
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.")
  }
  newBoard[rowNum][colNum] = (bIsNext) ? blackLetter : whiteLetter
  return newBoard
}

const checkCell = (board: BoardType, rowNumber: number, colNumber: number) : string => {
  if (
    rowNumber < 0 || colNumber < 0 || rowNumber >= board.length || colNumber >= board.length
  )
  {
    return(
      outsideLetter
    )
  }
  else {
    const cell = board[rowNumber][colNumber]
    if (cell === ""){
      return libertyLetter
    }
    else return cell
  }
}

const neighbourString = (board: BoardType, i: number, j: number) =>{
  // i is rowNumber, j is colNumber
  const north = checkCell( board, i-1, j )
  const south = checkCell( board, i+1, j )
  const west = checkCell( board, i, j-1 )
  const east = checkCell( board, i, j+1 )
  const combined = north + south + east + west
  return combined
  }

const startingShadowBoard = structuredClone(startingBoard)

const assessLibertyAcrossBoard = ({ gameBoard, shadowBoard } : {gameBoard: BoardType, shadowBoard: BoardType}): BoardType => {
  
  // This must take in both the gameBoard and the shadowBoard because it is recursive
  // and state of the shadowBoard changes at different levels of recursion

  const newGameBoard = structuredClone(gameBoard)
  const newShadowBoard = structuredClone(shadowBoard)

  for (let i=0; i<newGameBoard.length; i++){
    for (let j=0; j<newGameBoard.length; j++){

      // Check and skip anything that has already been assessed has having Liberty
      if (newShadowBoard[i][j] == "hasLiberty"){
        null 
      }

      // Any empty squares effectively have Liberty
      else if (gameBoard[i][j] == ""){
        newShadowBoard[i][j] = "hasLiberty"
      }

      // For non-empty spaces, we want to know what lives in the neighouring spaces
      else {
        const neighbours = neighbourString(gameBoard, i, j)

        // If one of those spaces is empty, you have Liberty
        if (neighbours.includes(libertyLetter)) {
          newShadowBoard[i][j] = "hasLiberty"
        }

        // If one of those spaces is non-empty, we have two conditions to gain Liberty.
        // Neighbouring space must:
        // 1 - Be of the same colour
        // 2 - Have Liberty

        // Let's check North
        else if ( checkCell(newGameBoard, i-1, j) === newGameBoard[i][j] && checkCell (newShadowBoard, i-1, j) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check South
        else if ( checkCell(newGameBoard, i+1, j) === newGameBoard[i][j] && checkCell (newShadowBoard, i+1, j) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check West
        else if ( checkCell(newGameBoard, i, j-1) === newGameBoard[i][j] && checkCell (newShadowBoard, i, j-1) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check East
        else if ( checkCell(newGameBoard, i, j+1) === newGameBoard[i][j] && checkCell (newShadowBoard, i, j+1) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
      }
    }
  }
  console.log("checkForCapturesBigger has been called and looped.")
  if (JSON.stringify(shadowBoard) != JSON.stringify(newShadowBoard)) {
    const newNewShadowBoard = assessLibertyAcrossBoard({gameBoard : gameBoard, shadowBoard : newShadowBoard});
    return newNewShadowBoard
  }
  else return newShadowBoard
}

const removeCapturedStones = ({ gameBoard, shadowBoard } : {gameBoard: BoardType, shadowBoard: BoardType}): BoardType => {
  const newGameBoard = structuredClone(gameBoard)

  for (let i=0; i<gameBoard.length; i++){
    for (let j=0; j<gameBoard.length; j++){

      if(shadowBoard[i][j] == "")
        {newGameBoard[i][j] = ""}

    }
  }
  return newGameBoard
}


export const checkWinCondition = (board: typeof startingBoard) : WinState => {
  
  // Enter Win Conditions here
  // 
  // 
  // 
  // 
  // 
  // return a WinCondition
    
  const moveCount = board.toString().replace(/,/g,'').length
  // without the /g global modifier this replace function will default to
  // only swapping out the first instance of the character

  const boardSize = board.length * board.length
  // square boards only

  if (moveCount >= boardSize) {
    return {outcome: "TIE", winner: null}
  }

  return {outcome: null, winner: null}
}

//// STYLING USED IN NextPlayerMessage AND ShowTile //// 

const blackTextClass = "text-black-800"
const blackStoneClass = "bg-zinc-600 rounded-full"

const whiteTextClass = "text-stone-300"
const whiteStoneClass = "bg-stone-100 rounded-full"

const NextPlayerMessage = ({ bIsNext: bIsNext } : { bIsNext: boolean }) => {

  const nextPlayer = (bIsNext) ? "Black" : "White"
  let className = (bIsNext) ? blackTextClass : whiteTextClass
  className = className + " text-2xl font-bold"
  return(
    <div>
      <div>
        Next move is:
      </div>
      <div className = {className}>
        {nextPlayer}
      </div>
    </div>
)
}

const ShowTile = ({rowNum, colNum, board, setBoard, bIsNext, setBIsNext }: {rowNum: number, colNum: number, board: BoardType, setBoard: Function, bIsNext: boolean, setBIsNext: Function}) => {

  const sharedClassName = "flex flex-col bg-orange-200 w-10 h-10 rounded-sm m-1 p-2 font-bold"
  const nullClass = "text-gray-500 cursor-pointer"

  const makeMove = () => {
    setBoard(getUpdatedBoard(board, rowNum, colNum, bIsNext))
    setBIsNext(!bIsNext)
  }

  if (board[rowNum][colNum] === blackLetter) {
    return(
      <div className = {sharedClassName + " " + blackTextClass}>
        <div className={blackStoneClass}>
          {blackLetter}
        </div>
      </div>
    )
  }
  if (board[rowNum][colNum] === whiteLetter) {
    return(
      <div className = {sharedClassName + " " + whiteTextClass}>
        <div className={whiteStoneClass}>
          {whiteLetter}
        </div>
      </div>
    )
  }
  else return (
    <a onClick={() => makeMove()}>
    <div className = {sharedClassName + " " + nullClass}>
      
    </div>
    </a>
  )
}

const ShowBoard = ({ board, setBoard, bIsNext, setBIsNext } : { board: BoardType, setBoard: Function, bIsNext: boolean, setBIsNext: Function} ) => {

  const sharedRowClassName = 'flex'

  return (
    <>
      {board.map(
        (rowArray, rowIndex) => {
          return(
              <div className={sharedRowClassName}>
              {rowArray.map(
                  (cell, colIndex) => 
                    <ShowTile 
                      rowNum={rowIndex} 
                      colNum={colIndex} 
                      board={board} 
                      setBoard={setBoard} 
                      bIsNext={bIsNext} 
                      setBIsNext={setBIsNext} />
              )}
            </div>
          )
        }
      )}


    </>
  )

}

const RefreshButton = ({ setBoard, setBIsNext } : { setBoard: Function, setBIsNext: Function }) => {
  
  const refreshBoard = () => {
    setBoard(startingBoard);
    setBIsNext(true)
  }

  return(
    <>
      <br />
      <button onClick={() => refreshBoard()}>Start again</button>
      <br />
    </>
  )
}

const ShowResults = ( {outcome, winner} : {outcome: string | null, winner: string | null }  ) => {
  if (outcome === "WIN"){
    return(
      <div>
        The winner is {winner}
        <br />
        Congratulations!
      </div>
    )
  }
  else if (outcome === "TIE"){
    return(
      <div>
        The game is TIED! No winner today.
      </div>
    )
  }
  else return null
}

function App() {
  console.log("==== APP REFRESH ====")
  const [board, setBoard] = useState(structuredClone(startingBoard))
  const [bIsNext, setBIsNext] = useState(true)

  const freshShadowBoard = assessLibertyAcrossBoard({gameBoard : board, shadowBoard : startingShadowBoard})
  const freshGameBoard = removeCapturedStones({gameBoard: board, shadowBoard: freshShadowBoard})

  const currentWinState = checkWinCondition(board)

  if(
    JSON.stringify(board) != JSON.stringify(freshGameBoard)
  ){
    console.log("Stone(s) have been captured.")
    setBoard(freshGameBoard)
  }

  return (
    <>
      <NextPlayerMessage bIsNext={bIsNext} />
      <br />

      <ShowBoard  board={board} setBoard= {setBoard} bIsNext={bIsNext} setBIsNext={setBIsNext}/>

      <RefreshButton setBoard = {setBoard} setBIsNext = {setBIsNext} />

      <ShowResults outcome={currentWinState.outcome} winner={currentWinState.winner} />
    </>
  )
}

export default App



// 
// COMING UP NEXT
// 
// Pass button
// protect the just placed stone (unless it's a suicide)
// influence version of shadowBoard
// End of game scoring
// Ko
// 


