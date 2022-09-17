import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
//------------------------------------------------------------------------------------
// Import styles and assets
// import icon from '../../assets/icon.svg';
import './App.css';
//------------------------------------------------------------------------------------
// Import pages
import Home from './pages/Home';
//------------------------------------------------------------------------------------
// Import components

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
