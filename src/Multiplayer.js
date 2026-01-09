import React, { useState, useEffect } from "react";
import "./index.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
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
      <h1> Current Player: {status} </h1>
      </>
    )
  }
}
   


function Board() {
  const [game, setGame] = useState({
    squares: Array(9).fill(null),
    xisnext: true,
    counts: Array(9).fill(0),
    colors: Array(9).fill('black'),
  })
  const [room, setRoom] = useState("")
  const [flag, setFlag] = useState({A:false, B:false})
  const [errorMessage, setErrorMessage] = useState("");
  //const [status, setStatus] = useState("Player X")
  const [scores, setScores] = useState({X: 0, O: 0})
  const [user, setUser] = useState("")
  const [nextUser, setNextUser] = useState("")
  const [ind, setInd] = useState(0)
  const [players, setPlayers] = useState({fp: "", sp:""})
  useEffect(() => {
    socket.on("moveMade", (data) => {
      setGame(data.updatedGame);
      setNextUser(data.nextUser)
      setInd(data.nextInd)
      setErrorMessage("");
    });

    socket.on("gameReset", (newGame) => {
      setGame(newGame);
      setErrorMessage("");
    });
    socket.on("won", (score) => {setScores(score)})
    socket.on("begin_game", (data) => {
      setNextUser(data.firstPlayer)
      setPlayers({fp:data.firstPlayer, sp:data.secondPlayer})
      setFlag({A:true, B:true})})
    socket.on("waiting", (msg) => {
      alert(msg)
      setFlag({A:true, B:false})})
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("error_message", (msg) => {
  alert(msg);
  setFlag({A: false, B: false}); // Send them back to the login screen
});

    return () => {
      socket.off("moveMade");
  socket.off("gameReset");
  socket.off("won");
  socket.off("begin_game");
  socket.off("waiting");
  socket.off("connect_error");
  socket.off("disconnect");
    };
  }, []);

  function handleclick(i){
    if(user != nextUser) return;
    if(game.squares[i]||checkdraw()||checkwin(game.squares))
      return;
   
    const nextSquares = game.squares.slice();
    const nextCounts = game.counts.slice()
    const nextColors = game.colors.slice()

    if (game.xisnext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    let count_X =0, count_O = 0;
    for(let a = 0; a <9; a++){
      if(nextSquares[a] === 'X') count_X += 1;
      if(nextSquares[a] === 'O') count_O +=1;
    }
    nextCounts[i] = game.xisnext ? count_X : count_O;
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
    const updatedGame = {
      counts: nextCounts,
      colors: nextColors,
      xisnext: !game.xisnext,
      squares: nextSquares,
    }
    socket.emit("makeMove",{ roomName:room, updatedGame, ind})
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
      socket.emit("win", {nextScores, room})
      setScores(nextScores)
      return;
    }
   
  }
  function handleclick2(){
    const newGame = {
      squares:Array(9).fill(null),
      counts: Array(9).fill(0),
      colors: Array(9).fill('black'),
      xisnext: game.xisnext,
    }
    socket.emit("resetGame", {room, newGame})
  }
  function checkwin(arr){
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
      if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
        return arr[a];
      }
    }
    return null;  
  }
  function checkdraw(){
    for(let i = 0; i <9; i++){
      if(game.squares[i] === null)
        return null;
    }
    return 'yes';
  }

  function join_room(){
    socket.emit("join_room", {username:user, room:room, game})
  }
  if(!(flag.A)) {
    return(
      <div>
        <h1>Join a room</h1>
        <input id = "roomid" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="room"></input>
        <input id = "username" value={user} onChange={(e) => setUser(e.target.value)} placeholder="user"></input>
        <button onClick={() => join_room()}>submit</button>
      </div>
    )
  }
  else if(!(flag.B)){
    return(
      <div>
        <h1>Please wait for 2nd player, {user}</h1>
      </div>
    )
  }
  else return (
    <>
    <div className="side-info">
        <p className='score'> Score X &#040;{players.fp}&#041; = {scores.X} <br></br> Score O &#040;{players.sp}&#041; = {scores.O}</p>
    </div>
      <div className = "centre">
      <DisplayText draw = {checkdraw()} win = {checkwin(game.squares)} status = {nextUser}/>
      <div className="board-row">
        <Square clr = {game.colors[0]} value = {game.squares[0]} onSquareClick = {() => handleclick(0)}/>
        <Square clr = {game.colors[1]} value = {game.squares[1]} onSquareClick={() => handleclick(1)}/>
        <Square clr = {game.colors[2]} value = {game.squares[2]} onSquareClick={() => handleclick(2)}/>
      </div>
      <div className="board-row">
      <Square clr = {game.colors[3]} value = {game.squares[3]} onSquareClick={() => handleclick(3)}/>
        <Square clr = {game.colors[4]} value = {game.squares[4]} onSquareClick={() => handleclick(4)}/>
        <Square clr = {game.colors[5]} value = {game.squares[5]} onSquareClick={() => handleclick(5)}/>
      </div>
      <div className="board-row">
      <Square clr = {game.colors[6]} value = {game.squares[6]} onSquareClick={() => handleclick(6)}/>
        <Square clr = {game.colors[7]} value = {game.squares[7]} onSquareClick={() => handleclick(7)}/>
        <Square clr = {game.colors[8]} value = {game.squares[8]} onSquareClick={() => handleclick(8)}/>
      </div>
      <button className= 'playagain' onClick={() => handleclick2()}>Reset</button>
      </div>
    </>
  );
}

export default Board


