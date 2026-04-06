import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Playlist />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;