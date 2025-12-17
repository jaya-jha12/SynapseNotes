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
    // --- 1. Define the Sync Function ---
    const syncUserWithBackend = async (session: Session) => {
      const user = session.user;
      const name = user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0];
      const email = user.email;

      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        // Call your new backend route
        const response = await fetch(`${API_BASE}/api/auth/google-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            username: name 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // CRITICAL: Save the BACKEND token, not the Supabase one.
          // Your middleware needs this specific token to allow creating notes.
          localStorage.setItem('token', data.token); 
          localStorage.setItem('username', data.username);
          
          // Update UI
          window.dispatchEvent(new Event("auth-change"));
        } else {
          console.error("Backend Sync Failed:", data.error);
        }
      } catch (error) {
        console.error("Sync Network Error:", error);
      }
    };

    // --- 2. Helper to handle session ---
    const handleSession = (session: Session) => {
      // Optimistically set Supabase token (temporary) until backend syncs
      localStorage.setItem('token', session.access_token);
      
      // Run the sync immediately
      syncUserWithBackend(session);
    };

    // --- A. Check active session on load ---
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        handleSession(session);
      }
    });

    // --- B. Listen for auth changes ---
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session) {
        handleSession(session);
      } else {
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