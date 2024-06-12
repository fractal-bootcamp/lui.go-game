import { useState } from 'react'

import './App.css'

// const player = {}

const startingBoard = [
  ['','',''],
  ['','',''],
  ['','',''],
]

const exampleBoard = [
  ['O','O','X'],
  ['','X','X'],
  ['O','O',''],
]

type WinState = {
  outcome: "WIN" | "TIE" | null;
  winner: "X" | "O" | null;
}

type BoardType = string[][]


const getUpdatedBoard = (board: BoardType, rowNum: number, colNum: number, xIsNext: boolean) => {
  let newBoard = [...board]
  const space = board[rowNum][colNum]
  console.log("space is", space.length)
  let newChar = ""
  
  if (space != ""){
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.")
  }
  else if (xIsNext) {
    newChar = "X"
    xIsNext = !xIsNext
  }
  else {
    newChar = "O"
    xIsNext = !xIsNext
  }
 
  newBoard[rowNum][colNum] = newChar
  console.log("newChar is", newChar)
  console.log("newBoard", newBoard)
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

// export const checkWinCondition = (b: typeof board) : WinState => {


export const checkWinCondition = (b: typeof exampleBoard) => {
  
  // Check the Rows
  for (let rowIndex = 0; rowIndex < 3; rowIndex++ ) {
    const rowCheckOutcome = checkRow(b[rowIndex])

  if (!!rowCheckOutcome.outcome) {
    return rowCheckOutcome
  }
  }

  // Check the Columns
  for (let colIndex = 0; colIndex < 3; colIndex++ ) {
    const colCheckOutcome = checkRow(getCol(b,colIndex))
    // getCol turns a column into an array, so it can be handled just like a Row

  if (!!colCheckOutcome.outcome) {
    return colCheckOutcome
  }
  }

  // Check the Diagonals
  const diagCheck1 = checkRow(getDiagonal(b, "nw"))
  if (!!diagCheck1.outcome) {
    return diagCheck1
    }

  const diagCheck2 = checkRow(getDiagonal(b, "ne"))
  if (!!diagCheck2.outcome) {
    return diagCheck2
    }
    

  const moveCount = b.toString().replace(/,/g,'').length
  // without the /g global modifier this replace function will default to
  // only swapping out the first instance of the character

  const boardSize = b.length * b.length
  // square boards only

  if (moveCount >= boardSize) {
    return {outcome: "TIE", winner: null}
  }


  return {outcome: null, winner: null}
  // win, tie, loss, or neither
  // if win, who won (X/O/null)

}

//// STYLING USED IN NextPlayerMessage AND ShowTile //// 

const xClass = "text-green-500"
const oClass = "text-purple-500"

const NextPlayerMessage = ({ xIsNext } : { xIsNext: boolean }) => {

  if(xIsNext){
    return(
      <div>
        <div>
          Next move is:
        </div>
        <div className = {xClass}>
          X
        </div>
      </div>
  )}

  else {
    return(
      <div>
        <div>
          You're up:
        </div>
        <div className = {oClass}>
          O
        </div>
      </div>
  )}
  
}

const ShowTile = ({rowNum, colNum, board, setBoard, xIsNext, setXIsNext }: {rowNum: number, colNum: number, board: BoardType, setBoard: Function, xIsNext: boolean, setXIsNext: Function}) => {

  const sharedClassName = "flex flex-col text-green-500 bg-gray-100 w-10 h-10 rounded-sm m-1 p-2"
  const nullClass = "text-gray-200 cursor-pointer"

  const makeMove = () => {
    setBoard(getUpdatedBoard(board, rowNum, colNum, xIsNext))
    setXIsNext(!xIsNext)
  }


  if (board[rowNum][colNum] ==="X") {
    return(
      <div className = {sharedClassName + " " + xClass}>
        X
      </div>
    )
  }
  if (board[rowNum][colNum] ==="O") {
    return(
      <div className = {sharedClassName + " " + oClass}>
        O
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

const ShowBoard = ({ board, setBoard, xIsNext, setXIsNext } : { board: BoardType, setBoard: Function, xIsNext: boolean, setXIsNext: Function} ) => {

  const sharedRowClassName = 'flex'

  const testClick = () => {
    console.log("testClick")
    const testThing = setBoard(getUpdatedBoard(board, 2, 2))
    console.log("testThing", testThing)
  }

  return (
    <>
    <div className={sharedRowClassName}>
      {/* {board[0].map(ShowTile(move=index, rowNum=0,colNum=index, board=board, setBoard=setBoard))} */}

      <ShowTile rowNum={0} colNum={0} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={0} colNum={1} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={0} colNum={2} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />

    </div>

    <div className={sharedRowClassName}>
      <ShowTile rowNum={1} colNum={0} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={1} colNum={1} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={1} colNum={2} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />

    </div>

    <div className={sharedRowClassName}>
      <ShowTile rowNum={2} colNum={0} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={2} colNum={1} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />
      <ShowTile rowNum={2} colNum={2} board={board} setBoard={setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext} />

    </div>

    {/* <div className={sharedRowClassName}>
      {board[1].map(ShowTile)}
    </div>

    <div className={sharedRowClassName}>
      {board[2].map(ShowTile)}
    </div> */}
    </>
  )

}

const RefreshButton = ({ setBoard } : { setBoard: Function }) => {
  
  const refreshBoard = () => {
    // debugger;
    console.log(startingBoard)
    setBoard(startingBoard);
    console.log(startingBoard)
    console.log("yesss")
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

  const [xIsNext, setXIsNext] = useState(true)



  const currentWinState = checkWinCondition(board)

  return (
    <>
      <NextPlayerMessage xIsNext={xIsNext} />
      <br />

      <ShowBoard  board={board} setBoard= {setBoard} xIsNext={xIsNext} setXIsNext={setXIsNext}/>

      <RefreshButton setBoard = {setBoard} />

      <ShowResults outcome={currentWinState.outcome} winner={currentWinState.winner} />
    </>
  )
}

export default App
