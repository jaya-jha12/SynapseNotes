import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirects back to your app after login
          redirectTo: `${window.location.origin}/`, 
        },
      });

      if (error) throw error;
      
      // Note: The actual redirect happens automatically by Supabase here.
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full gap-3 px-4 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors text-white font-medium"
    >
      <img 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      Continue with Google
    </button>
  );
};