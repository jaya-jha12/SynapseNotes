import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Navbar } from "./components/Navbar";
import { SignupSlider } from "./pages/Auth";
import { MyNotes } from './pages/MyNotes';
import { NoteEditor } from "./pages/NoteEditor";
import { Toaster } from "react-hot-toast";
import { Summarise } from './pages/Summarise';
import { TranscribePage } from './pages/Transcribe';
import { ImageToNotesPage } from './pages/Image';
import { supabase } from './supabaseClient'; 
import {type Session} from '@supabase/supabase-js';

function App() {

  useEffect(() => {
    // 1. Check active session
    // Explicitly type 'session' as Session | null
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => { // Added types here
      if (session) {
        localStorage.setItem('token', session.access_token);
        // ... rest of your logic
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignupSlider />} />
          <Route path="/mynotes" element={<MyNotes />} />
          <Route path="/editor/:id" element={<NoteEditor />} />
          <Route path="/summarise" element={<Summarise />} />
          <Route path="/transcribe" element={<TranscribePage />} />
          <Route path="/image" element={<ImageToNotesPage />} />
        </Routes>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </div>
    </BrowserRouter>
  );
}

export default App;