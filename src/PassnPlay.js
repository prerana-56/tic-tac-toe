import  { useState } from "react";
import "./index.css";

function Square({value, onSquareClick, clr}) {
  const buttonStyle = {
    color: clr // Applying the color to the text inside the button
  };
  return (
    <button style={buttonStyle} className="square" onClick={onSquareClick}>{value}</button>
  );
 
 
}

function DisplayText({draw, win, status}){
    const st = {color:'rgb(39, 177, 39)'}
  if(draw === 'yes'){
    return(
      <h1 className='draw'>OH NO! IT'S A DRAW</h1>
    );
  }
  else if(win !== null){
    return(
      <>
      <h1 style={st}>PLAYER {win} WINS! </h1>
      </>
    )
  }
  else{
    return(
      <>
      <h1> {status} </h1>
      </>
    )
  }
}

function Board() {
  const[squares, setSquares] = useState(Array(9).fill(null))
  const [xisnext, setxisnext] = useState(true)
  const [counts , setCounts]= useState(Array(9).fill(0))
  const[colors, setcolors] = useState(Array(9).fill('black'))
  const [scores, setScores] = useState({X:0, O:0})
  const [status, setStatus] = useState("Player X")

  function handleclick(i){
    if(squares[i]||checkdraw()||checkwin(squares))
      return;
   
    const nextSquares = squares.slice();
    const nextCounts = counts.slice()
    const nextColors = colors.slice()
    let nextStatus = status

    if (xisnext) {
      nextSquares[i] = 'X';
      nextStatus = "Player O";
    } else {
      nextSquares[i] = 'O';
      nextStatus = "Player X"
    }
    let count_X =0, count_O = 0;
    for(let a = 0; a <9; a++){
      if(nextSquares[a] === 'X') count_X += 1;
      if(nextSquares[a] === 'O') count_O +=1;
    }
    nextCounts[i] = xisnext ? count_X : count_O;
    let curr_player = nextSquares[i];
    if (nextCounts[i] === 4) {
      for (let j = 0; j < 9; j++) {
        if (nextCounts[j] === 1 && nextSquares[j] === curr_player) {
          nextSquares[j] = null;
          nextColors[j] = 'black';
          nextCounts[j] = 0;
        }
        if (nextCounts[j] !== 0 && nextSquares[j] === curr_player) nextCounts[j] -= 1;
       
      }
    }


    if (nextCounts[i] === 3) {
      for(let k = 0; k <9; k++){
        if(nextCounts[k] === 1 && nextSquares[k] === curr_player)
          nextColors[k] = 'gray'
    }
  }
    setCounts(nextCounts)
    setcolors(nextColors)
    setxisnext(!xisnext);
    setSquares(nextSquares);
    setStatus(nextStatus)
    let nextScores = {...scores}
    if(checkwin(nextSquares)){
      let winner = checkwin(nextSquares)
      if(winner === 'X'){
        nextScores = {
          X: scores.X +1, O: scores.O
        }
      }
      else nextScores = {
          X: scores.X, O: scores.O + 1
        }
      setScores(nextScores)
      return;
    }
   
  }
  function handleclick2(){
    setSquares(Array(9).fill(null))
    setCounts(Array(9).fill(0))
    setcolors(Array(9).fill('black'))
  }
  function checkwin(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;  
  }
  function checkdraw(){
    for(let i = 0; i <9; i++){
      if(squares[i] === null)
        return null;
    }
    return 'yes';
  }
  return (
    <>
    <div className="side-info">
        <p className='score'> Score X = {scores.X} <br></br> Score O = {scores.O}</p>
    </div>
      <div className = "centre">
        <DisplayText draw = {checkdraw()} win = {checkwin(squares)} status = {status}/>
      <div className="board-row">
        <Square clr = {colors[0]} value = {squares[0]} onSquareClick = {() => handleclick(0)}/>
        <Square clr = {colors[1]} value = {squares[1]} onSquareClick={() => handleclick(1)}/>
        <Square clr = {colors[2]} value = {squares[2]} onSquareClick={() => handleclick(2)}/>
      </div>
      <div className="board-row">
      <Square clr = {colors[3]} value = {squares[3]} onSquareClick={() => handleclick(3)}/>
        <Square clr = {colors[4]} value = {squares[4]} onSquareClick={() => handleclick(4)}/>
        <Square clr = {colors[5]} value = {squares[5]} onSquareClick={() => handleclick(5)}/>
      </div>
      <div className="board-row">
      <Square clr = {colors[6]} value = {squares[6]} onSquareClick={() => handleclick(6)}/>
        <Square clr = {colors[7]} value = {squares[7]} onSquareClick={() => handleclick(7)}/>
        <Square clr = {colors[8]} value = {squares[8]} onSquareClick={() => handleclick(8)}/>
      </div>
        <button className= 'playagain' onClick={() => handleclick2()}>Play Again?</button>
      </div>
    </>
  );
}
export default Board



