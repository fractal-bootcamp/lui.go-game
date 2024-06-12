import { useState } from 'react'

import './App.css'
import { arrayGenerator } from './components/ArrayGenerator';

const startingBoard = arrayGenerator(13)


const exampleBoard = [
  ['B','B','B'],
  ['','W','B'],
  ['B','W',''],
]

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

const checkRow = (row: string[]) => {
  const winner = row.reduce((prev: string | null, curr: string) => {
    if (prev === "") {
      return null
    }
    if (prev === curr) {
      return curr
    }
    return null
  }
)
// array.reduce(previous, current) will cycle through
// all the items in an array and run the function against
//
return {outcome: !!winner ? "WIN" : null,  winner: winner}
// !! checks if something exists
// ? is ternary operator, gives first result if True, second if False

}


const getCol = (board: typeof exampleBoard, colIndex: number) => {
  const colArray = []

  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    colArray.push(board[rowIndex][colIndex])
  }
  return colArray

}

const getDiagonal = (board: typeof exampleBoard, startingPoint: "nw" | "ne") => {
  
  if (startingPoint === "nw"){
    const diagonalArray = []
    for (let i = 0; i < board.length; i++) {
      diagonalArray.push(board[i][i])
    }
    return diagonalArray
  }

  else if (startingPoint === "ne") {
    const diagonalArray = []
    for (let i = 0; i < board.length; i++) {
      // desired coords here are [2][0] ... [1][1] ... [0][2]
      diagonalArray.push(board[board.length -1 - i][i])
    }
    return diagonalArray
  }
  else console.log("ERROR: irregular diagonal startPoint value passed")
}

export const checkWinCondition = (board: typeof exampleBoard) : WinState => {
  
  // Check the Rows
  for (let rowIndex = 0; rowIndex < 3; rowIndex++ ) {
    const rowWinCondition = checkRow(board[rowIndex])

  if (!!rowWinCondition.outcome) {
    return rowWinCondition
  }
  }

  // Check the Columns
  for (let colIndex = 0; colIndex < 3; colIndex++ ) {
    const colWinCondition = checkRow(getCol(board,colIndex))
    // getCol turns a column into an array, so it can be handled just like a Row

  if (!!colWinCondition.outcome) {
    return colWinCondition
  }
  }

  // Check the Diagonals
  const diagCheck1 = checkRow(getDiagonal(board, "nw"))
  if (!!diagCheck1.outcome) {
    return diagCheck1
    }

  const diagCheck2 = checkRow(getDiagonal(board, "ne"))
  if (!!diagCheck2.outcome) {
    return diagCheck2
    }
    
  const moveCount = board.toString().replace(/,/g,'').length
  // without the /g global modifier this replace function will default to
  // only swapping out the first instance of the character

  const boardSize = board.length * board.length
  // square boards only

  if (moveCount >= boardSize) {
    return {outcome: "TIE", winner: null}
  }

  return {outcome: null, winner: null}
  // win, tie, loss, or neither
  // if win, who won (X/O/null)

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

  const testClick = () => {
    console.log("testClick")
    const testThing = setBoard(getUpdatedBoard(board, 2, 2))
    console.log("testThing", testThing)
  }

  return (
    <>
      {board.map(
        (rowArray, rowIndex) => {
          console.log("heyy")
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
