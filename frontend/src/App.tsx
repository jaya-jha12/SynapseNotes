//import { useState } from 'react'
import './App.css'
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from "./components/Navbar";

function App() {

  return (
    <BrowserRouter>
      <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
