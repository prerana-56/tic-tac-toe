import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Multiplayer from "./Multiplayer";
import PassnPlay from "./PassnPlay";
import Main from "./Main";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Main />} />
                <Route path="/Multiplayer" element={<Multiplayer />} />
                <Route
                    path="/PassnPlay"
                    element={<PassnPlay />}
                />
            </Routes>
        </Router>
    );
}

export default App;