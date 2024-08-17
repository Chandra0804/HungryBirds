import './App.css'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import RestaurantDetails from './pages/details'

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
