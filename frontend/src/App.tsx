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
import { type Session } from '@supabase/supabase-js';

function App() {

  useEffect(() => {
    // Helper function to handle session data and update UI
    const handleSession = (session: Session) => {
      localStorage.setItem('token', session.access_token);

      // 1. Extract Name from Google Metadata
      const user = session.user;
      const name = user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0];
      
      if (name) {
        localStorage.setItem('username', name);
      }

      // 2. Trigger Navbar Update
      window.dispatchEvent(new Event("auth-change"));
    };

    // --- A. Check active session on load ---
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        handleSession(session);
      }
    });

    // --- B. Listen for auth changes (Login, Logout, Auto-Refresh) ---
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session) {
        handleSession(session);
      } else {
        // Logout cleanup
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event("auth-change"));
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