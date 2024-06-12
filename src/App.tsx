import { useState } from 'react'

import './App.css'
import { arrayGenerator } from './components/ArrayGenerator';

const startingBoard = arrayGenerator(13)

type WinState = {
  outcome: "WIN" | "TIE" | null;
  winner: "B" | "W" | null;
}

type BoardType = string[][]


const getUpdatedBoard = (board: BoardType, rowNum: number, colNum: number, bIsNext: boolean) => {
  const newBoard = structuredClone(board)  
  if (board[rowNum][colNum] != ""){
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.")
  }
 
  newBoard[rowNum][colNum] = (bIsNext) ? "B" : "W"
  return newBoard
}


export const checkWinCondition = (board: typeof exampleBoard) : WinState => {
  
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

  if (board[rowNum][colNum] ==="B") {
    return(
      <div className = {sharedClassName + " " + blackTextClass}>
        <div className={blackStoneClass}>
          B
        </div>
      </div>
    )
  }
  if (board[rowNum][colNum] ==="W") {
    return(
      <div className = {sharedClassName + " " + whiteTextClass}>
        <div className={whiteStoneClass}>
          W
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
