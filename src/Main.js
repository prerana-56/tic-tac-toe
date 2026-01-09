import { Link } from 'react-router-dom';
import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';
import "./index.css"

function Main(){
    return(
        <>
        <div className='bg'>
        <div className='centre'>
            <div className='geeks'>
            <h1>Undrawable tic-tac-toe</h1>
            </div>
            <span className='txt'>Welcome to undrawable tic-tac-toe. Here's how it works: At most, there can only be three of your icons &#040;X or O&#041; 
                on the board at a time. <br />When you have three pieces on the board, the piece you placed first goes gray. On the next turn, the grey piece vanishes! Like so:</span>
        </div>
        <div>
            <img src= {img1} className='descimg'></img>
            <img src= {img2} className='descimg'></img>
            <img src= {img3} className='descimg'></img>
        </div>
        <div className='centre'>
            <h1>Which would you like to play?</h1>
        </div>
        <div> 
            <h2><Link to="/Multiplayer" className='txt1'>1. Multiplayer &#040;Online&#041;</Link><Link to="/PassnPlay" className='txt2' >2. Pass and Play</Link></h2>
        </div>
        </div>
        </>
    )
}
export default Main
