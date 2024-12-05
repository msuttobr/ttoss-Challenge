import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Voting from "./components/Voting";
import RankingPage from "./components/Ranking";
import './styles/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Voting />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </Router>
  );
}

export default App;