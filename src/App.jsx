import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './modules/home'
import {Routes,Route,BrowserRouter as Router } from "react-router-dom"
import Account from './modules/account'
import Aviator from './modules/aviator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
          <Routes>
              <Route exact path="/"  element={<Home/>} />
              <Route exact path="/account"  element={<Account />} />
              <Route exact path="/aviator"  element={<Aviator />} />
           </Routes>

    </div>
  )
}

export default App
