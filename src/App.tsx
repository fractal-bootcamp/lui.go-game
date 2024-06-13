import { useState } from 'react'

import './App.css'
import { numberBoardGenerator, textBoardGenerator } from './components/ArrayGenerator';

const blackString = "Black"
const whiteString = "White"

const blackLetter = blackString[0]
const whiteLetter = whiteString[0]
const emptyLetter = "E"
const outsideLetter = "X"

const boardLength = 6
const startingBoard = textBoardGenerator(boardLength, emptyLetter)
const startingShadowBoard = textBoardGenerator(boardLength, "")
const startingInfluenceBoard = numberBoardGenerator(boardLength, 0)

type TextBoard = string[][]
type NumberBoard = number[][]

const getUpdatedBoard = (board: TextBoard, rowNum: number, colNum: number, bIsNext: boolean) : TextBoard => {
  // This takes in a game board state and a move
  // and returns an updated board with that move incorporated
  const newBoard = structuredClone(board)  
  if (board[rowNum][colNum] != emptyLetter){
    console.log("ERROR: getUpdatedBoard attempted on occupied tile.")
  }
  newBoard[rowNum][colNum] = (bIsNext) ? blackLetter : whiteLetter
  return newBoard
}

const checkCell = (board: TextBoard, rowNumber: number, colNumber: number) : string => {
  // Lets you check a cell on a board without worrying about
  // whether your coordinates are out of bounds
  if (
    rowNumber < 0 || colNumber < 0 || rowNumber >= board.length || colNumber >= board.length
  )
  {
    return outsideLetter
  }
  else return board[rowNumber][colNumber]
}


// This approach does NOT work
// Need to either return a board, or just use a function like this to confirm that a tile is valid
const addToCell = (board: number[][], rowNumber: number, colNumber: number, operand: number, isPositive: boolean ) : void => {
  // Lets you add number to a number[][] board without worrying about
  // whether your coordinates are out of bounds
  if (
    rowNumber < 0 || colNumber < 0 || rowNumber >= board.length || colNumber >= board.length
  )
  {
    console.log("Yup")
  }
  else {
    if (isPositive) {
      board[rowNumber][colNumber] += operand
    }
    else {
      board[rowNumber][colNumber] -= operand
    }
    
  }

}

const validTile = (board: number[][] | string[][], rowNumber: number, colNumber: number ) : boolean => {
  if (
    rowNumber < 0 || colNumber < 0 || rowNumber >= board.length || colNumber >= board.length
  ){return false}
  else return true
}

const neighbourString = (board: TextBoard, i: number, j: number) =>{
  // Returns a string of the pieces occupying four neighbouring spaces
  // i is rowNumber, j is colNumber
  const north = checkCell( board, i-1, j )
  const south = checkCell( board, i+1, j )
  const west = checkCell( board, i, j-1 )
  const east = checkCell( board, i, j+1 )
  const combined = north + south + east + west
  return combined
  }


const assessLibertyAcrossBoard = ({ gameBoard, shadowBoard, focusOnBlack } : {gameBoard: TextBoard, shadowBoard: TextBoard, focusOnBlack: boolean}): TextBoard => {
  
  // After Black moves, we assess White's stones first, and then assess Black's (to assess for suicides)
  // So each time we run this function we focus on a single Player
  // If we're not focusing on the Player, we treat all their pieces as being safe, i.e. "hasLiberty"

  const safeLetter = (focusOnBlack) ? whiteLetter : blackLetter

  // This must take in both the gameBoard and the shadowBoard because it is recursive
  // and state of the shadowBoard changes at different levels of recursion

  const newShadowBoard = structuredClone(shadowBoard)

  for (let i=0; i<gameBoard.length; i++){
    for (let j=0; j<gameBoard.length; j++){

      // Check and skip anything that has already been assessed has having Liberty
      if (newShadowBoard[i][j] == "hasLiberty"){
        null 
      }

      // Any empty squares effectively have Liberty
      else if (gameBoard[i][j] == emptyLetter){
        newShadowBoard[i][j] = "hasLiberty"
      }

      // Every time we run this function one player is treated as "Safe"
      // Let's just pretend here their pieces enjoy liberty
      else if (gameBoard[i][j] == safeLetter){
        newShadowBoard[i][j] = "hasLiberty"
      }

      // For non-empty spaces, we want to know what lives in the neighouring spaces
      else {
        const neighbours = neighbourString(gameBoard, i, j)

        // If one of those spaces is empty, you have Liberty
        if (neighbours.includes(emptyLetter)) {
          newShadowBoard[i][j] = "hasLiberty"
        }

        // If you're the most recently placed stone
        // If one of those spaces is non-empty, we have two conditions to gain Liberty.
        // Neighbouring space must:
        // 1 - Be of the same colour
        // 2 - Have Liberty

        // Let's check North
        else if ( checkCell(gameBoard, i-1, j) === gameBoard[i][j] && checkCell (newShadowBoard, i-1, j) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check South
        else if ( checkCell(gameBoard, i+1, j) === gameBoard[i][j] && checkCell (newShadowBoard, i+1, j) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check West
        else if ( checkCell(gameBoard, i, j-1) === gameBoard[i][j] && checkCell (newShadowBoard, i, j-1) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
        // Let's check East
        else if ( checkCell(gameBoard, i, j+1) === gameBoard[i][j] && checkCell (newShadowBoard, i, j+1) === "hasLiberty") {
          newShadowBoard[i][j] = "hasLiberty"
        }
      }
    }
  }
  console.log("Recursive function called: assessLibertyAcrossBoard")
  if (JSON.stringify(shadowBoard) != JSON.stringify(newShadowBoard)) {
    const newNewShadowBoard = assessLibertyAcrossBoard({gameBoard : gameBoard, shadowBoard : newShadowBoard, focusOnBlack: focusOnBlack});
    return newNewShadowBoard
  }
  else return newShadowBoard
}

const removeCapturedStones = ({ gameBoard, shadowBoard } : {gameBoard: TextBoard, shadowBoard: TextBoard}): TextBoard => {
  const newGameBoard = structuredClone(gameBoard)

  for (let i=0; i<gameBoard.length; i++){
    for (let j=0; j<gameBoard.length; j++){

      // On shadowBoard, empty string at this stage means we have confirmed they do not have liberties
      if(shadowBoard[i][j] == "")
        {newGameBoard[i][j] = emptyLetter}
    }
  }
  return newGameBoard
}








const assessInfluenceAcrossBoard = ({ gameBoard, influenceBoard } : { gameBoard: TextBoard, influenceBoard: NumberBoard }): NumberBoard => {
  
  // We assess influence without reference to whose go it is
  // Function must take in both the gameBoard and the influenceBoard because it is recursive
  // and state of the influenceBoard changes at different levels of recursion


  // TBD - do we need to limit this with a recursion count?

  const newInfluenceBoard = structuredClone(influenceBoard)

  // Algorithm Parameters

  const maxInfluence = 10

  const localInfluence = 4
  const cardinalInfluence = 2
  const intercardinalInfluence = 1
  const supercardinalInfluence = 1

  // local means the stone's one tile
  // cardinal means N | S | W | E
  // intercardinal means NW | NE | SW | SE
  // supercardinal (made up word) here means NN | SS | WW | EE

  for (let i=0; i<gameBoard.length; i++){
    for (let j=0; j<gameBoard.length; j++){

      // Skip anything that has already hit a maximum influence
      // if (Math.abs(newInfluenceBoard[i][j]) >= maxInfluence){
      //   null 
      // }


      // For the influence values:
      // BLACK = POSITIVE INTEGERS
      // WHITE = NEGATIVE INTEGERS

      const isPositive = (gameBoard[i][j] === blackLetter)
      
      // If the tile has a stone on it, assign local, cardinal, inter, super influences
      if (gameBoard[i][j] === blackLetter || gameBoard[i][j] === whiteLetter){

        addToCell(newInfluenceBoard, i , j, localInfluence, isPositive)

        // if(validTile(newInfluenceBoard, i+1 , j)){newInfluenceBoard[i+1][j] += cardinalInfluence }
        // if(validTile(newInfluenceBoard, i-1 , j)){newInfluenceBoard[i-1][j] += cardinalInfluence }
        // if(validTile(newInfluenceBoard, i , j+1)){newInfluenceBoard[i][j+1] += cardinalInfluence }
        // if(validTile(newInfluenceBoard, i , j-1)){newInfluenceBoard[i][-1] += cardinalInfluence }

        addToCell(newInfluenceBoard, i+1 , j, cardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i-1, j, cardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i, j+1, cardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i, j-1, cardinalInfluence, isPositive)

        addToCell(newInfluenceBoard, i+1 , j+1, intercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i+1, j-1, intercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i-1, j+1, intercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i-1, j-1, intercardinalInfluence, isPositive)

        addToCell(newInfluenceBoard, i+2 , j, supercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i-2, j, supercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i, j+2, supercardinalInfluence, isPositive)
        addToCell(newInfluenceBoard, i, j-2, supercardinalInfluence, isPositive)
      }

      // If an empty tile is as strongly influenced as if it had a stone
      // let's give it a soft onward influence
      // Black first
      // else if (newInfluenceBoard[i][j] > localInfluence) {
      //   addToCell(newInfluenceBoard, i+1 , j, supercardinalInfluence, true)
      //   addToCell(newInfluenceBoard, i-1, j, supercardinalInfluence, true)
      //   addToCell(newInfluenceBoard, i, j+1, supercardinalInfluence, true)
      //   addToCell(newInfluenceBoard, i, j-1, supercardinalInfluence, true)
      // }
      // // then White
      // else if (newInfluenceBoard[i][j] < -localInfluence) {
      //   addToCell(newInfluenceBoard, i+1 , j, supercardinalInfluence, false)
      //   addToCell(newInfluenceBoard, i-1, j, supercardinalInfluence, false)
      //   addToCell(newInfluenceBoard, i, j+1, supercardinalInfluence, false)
      //   addToCell(newInfluenceBoard, i, j-1, supercardinalInfluence, false)
      // }
    }
  }

  // console.log("Recursive function called: assessInfluenceAcrossBoard")
  // if (JSON.stringify(influenceBoard) != JSON.stringify(newInfluenceBoard)) {
  //   const newNewInfluenceBoard = assessInfluenceAcrossBoard({gameBoard : gameBoard, influenceBoard : newInfluenceBoard});
  //   return newNewInfluenceBoard
  // }
  // else return newInfluenceBoard

  return newInfluenceBoard

}


























type WinState = {
  outcome: string | null,
  winner: string | null,
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

const NextPlayerMessage = ({ bIsNext } : { bIsNext: boolean }) => {

  const nextPlayer = (bIsNext) ? blackString : whiteString
  let className = (bIsNext) ? blackTextClass : whiteTextClass
  className = className + " text-2xl font-bold"
  return(
    <div className='p-5'>
      <div>
        Next move is:
      </div>
      <div className = {className}>
        {nextPlayer}
      </div>
    </div>
)
}

const ShowTile = ({rowNum, colNum, board, setBoard, bIsNext, setBIsNext, influence } : {rowNum: number, colNum: number, board: TextBoard, setBoard: Function, bIsNext: boolean, setBIsNext: Function, influence: NumberBoard}) => {

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
  else if (board[rowNum][colNum] === emptyLetter) {
    const localInfluence = influence[rowNum][colNum]
    const showInfluence = (localInfluence != 0)
    const tileDisplay = (showInfluence) ? localInfluence : ""
    return (
      <a onClick={() => makeMove()}>
      <div className = {sharedClassName + " " + nullClass}>
        {tileDisplay}
      </div>
      </a>
    )}
  else {
    console.log("ERROR: Tiles detected with irregular values.")
    return(
      <div></div>
  )
}
}

const ShowBoard = ({ board, setBoard, bIsNext, setBIsNext, influence } : { board: TextBoard, setBoard: Function, bIsNext: boolean, setBIsNext: Function, influence: NumberBoard} ) => {

  const sharedRowClassName = 'flex'

  return (
    <>
      {board.map(
        (rowArray, rowIndex) => {
          return(
              <div className={sharedRowClassName}>
              {rowArray.map(
                // if have a  declared value and you don't intend to ever call it, give it an underscore
                  (_cell, colIndex) => 
                    <ShowTile 
                      rowNum={rowIndex} 
                      colNum={colIndex} 
                      board={board} 
                      setBoard={setBoard} 
                      bIsNext={bIsNext} 
                      setBIsNext={setBIsNext}
                      influence={influence}
                       />
              )}
            </div>
          )
        }
      )}
    </>
  )

}

const buttonStyling = 'p-5'

const PassButton = ({ bIsNext , setBIsNext, passCount, setPassCount } : { bIsNext: boolean, setBIsNext: Function, passCount: number, setPassCount: Function }) => {
  const onPass = () => {
    setPassCount(passCount+1);
    setBIsNext(!bIsNext)
  }
  return(
    <div className={buttonStyling}>
      <button onClick={() => onPass()}>Pass</button>
    </div>
)
}
const RefreshButton = ({ setBoard, setBIsNext, setPassCount  } : { setBoard: Function, setBIsNext: Function, setPassCount: Function }) => {
  
  const refreshBoard = () => {
    setBoard(startingBoard);
    setBIsNext(true);
    setPassCount(0);
  }

  return(
    <div className={buttonStyling}>
      <button onClick={() => refreshBoard()}>Start again</button>
    </div>
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
  const [passCount, setPassCount] = useState(0)

  // We don't need to run our heavy algos if a user has just passed
  if (passCount === 0){

    // We run this once where we treat the player who just moved as "Safe"
    const freshShadowBoard = assessLibertyAcrossBoard({gameBoard : board, shadowBoard : startingShadowBoard, focusOnBlack : bIsNext})
    const freshGameBoard = removeCapturedStones({gameBoard: board, shadowBoard: freshShadowBoard})
  
    // Then we run it again to assess for suicides
    const freshShadowBoard2 = assessLibertyAcrossBoard({gameBoard : freshGameBoard, shadowBoard : startingShadowBoard, focusOnBlack : !bIsNext})
    const freshGameBoard2 = removeCapturedStones({gameBoard: freshGameBoard, shadowBoard: freshShadowBoard2})

    if(
      JSON.stringify(board) != JSON.stringify(freshGameBoard2)
    ){
      console.log("Stone(s) have been captured.")
      setBoard(freshGameBoard2)
    }

  }

  let currentWinState = checkWinCondition(board)

  if (passCount > 1){
    currentWinState = {
      // dummy date for now
      outcome: "WIN", 
      winner: blackString
    }
  }

  const influence = assessInfluenceAcrossBoard( { gameBoard : board, influenceBoard: startingInfluenceBoard} )
  console.log(influence)

  return (
    <>
      <NextPlayerMessage bIsNext={bIsNext} />

      <ShowBoard board={board} setBoard= {setBoard} bIsNext={bIsNext} setBIsNext={setBIsNext} influence={influence} />

      <PassButton bIsNext = {bIsNext} setBIsNext = {setBIsNext} passCount = {passCount} setPassCount = {setPassCount}/>

      <RefreshButton setBoard = {setBoard} setBIsNext = {setBIsNext} setPassCount = {setPassCount}/>

      <ShowResults outcome={currentWinState.outcome} winner={currentWinState.winner} />
    </>
  )
}

export default App



// 
// COMING UP NEXT
// 
// Influence version of shadowBoard
// Count captured pieces somewhere
// End of game scoring
// Display captured pieces on sides
// NPC opponent
// Make NPC optional
// Let user choose colours
// Ko
// Snazzy alert when Atari happens 
//


