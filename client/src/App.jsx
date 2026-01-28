// client/src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import StudyMode from './pages/StudyMode'
import Game from './pages/Game'
import MapPage from './pages/MapPage'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/game" element={<Game />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App