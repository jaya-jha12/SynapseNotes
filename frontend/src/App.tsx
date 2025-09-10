//import { useState } from 'react'
import './App.css'
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from "./components/Navbar";
import { SignupSlider } from "./pages/Auth";
import { MyNotes } from './pages/MyNotes';
import { NoteEditor } from "./pages/NoteEditor";
import { Toaster } from "react-hot-toast";
import { Summarise } from './pages/Summarise';

function App() {

  return (
    <BrowserRouter>
    <div className="bg-black min-h-screen">
      <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignupSlider />} />
      <Route path="/mynotes" element={<MyNotes />} />
      <Route path="/noteeditor" element={<NoteEditor />} />
      <Route path="/summarise" element={<Summarise />} />
    </Routes>
    <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </div>
    </BrowserRouter>
  )
}

export default App
