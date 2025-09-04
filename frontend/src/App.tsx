//import { useState } from 'react'
import './App.css'
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from "./components/Navbar";
import { SignupSlider } from "./pages/Auth";

function App() {

  return (
    <BrowserRouter>
      <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignupSlider />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
