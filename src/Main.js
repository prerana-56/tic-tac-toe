import { Link } from 'react-router-dom';
function Main(){
    return(
        <>
        <div>
            <h1>Which would you like to play?</h1>
        </div>
        <div> 
            <h2><Link to="/Multiplayer">1. Multiplayer</Link></h2>
            <br />
            <h2><Link to="/PassnPlay">2. PassnPlay</Link></h2>
        </div>
        </>
    )
}
export default Main