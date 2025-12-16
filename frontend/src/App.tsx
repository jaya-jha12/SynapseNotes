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

function App() {

  useEffect(() => {
    // Helper to set local storage
    const setSessionData = (session: any) => {
      localStorage.setItem('token', session.access_token);
      const user = session.user;
      // Google usually provides 'full_name' or 'name' in metadata
      const name = user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0];
      
      localStorage.setItem('username', name);
    };

    // 1. Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionData(session);
      }
    });

    // 2. Listen for auth changes (Login, Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionData(session);
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