//import { useState } from 'react'
import './App.css'
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from "./components/Navbar";
import { SignupSlider } from "./pages/Auth";
import {MyNotes} from './pages/MyNotes';

function App() {

  return (
    <BrowserRouter>
    <div className="bg-black min-h-screen">
      <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignupSlider />} />
      <Route path="/mynotes" element={<MyNotes />} />
    </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
