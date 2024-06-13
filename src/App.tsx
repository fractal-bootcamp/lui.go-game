import { useState } from 'react'

import './App.css'
import { arrayGenerator } from './components/ArrayGenerator';

const startingBoard = arrayGenerator(9)

const blackLetter = "B"
const whiteLetter = "W"
const outsideLetter = "X"
const libertyLetter = "L"

type WinState = {
  outcome: string | null;
  winner: string | null;
}

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

checkCell(startingBoard, 10, 1)

const checkForCaptures = (board: BoardType): BoardType => {

  // i refers to rowNumber, j refers to colNumber
  const newBoard = structuredClone(board)

  for (let i=0; i<board.length; i++){
    for (let j=0; j<board.length; j++){
      const north = checkCell( board, i-1, j )
      const south = checkCell( board, i+1, j )
      const west = checkCell( board, i, j-1 )
      const east = checkCell( board, i, j+1 )
      const combined = north + south + east + west

      if (!combined.includes(libertyLetter) && !combined.includes(board[i][j])){
        newBoard[i][j] = ""
        // Add in some kind of count of captured pieces here as well
      }
    }
  }
  return(newBoard)
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

  const currentWinState = checkWinCondition(board)

  const newBoard = checkForCaptures(board)
  if(
    JSON.stringify(board) != JSON.stringify(newBoard)
  ){
    console.log("not the same")
    setBoard(newBoard)
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
