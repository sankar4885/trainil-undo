'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DebugAuth() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      } else {
        setSession(data.session);
      }
    }
    checkAuth();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/dashboard',
        },
      });

      if (error) {
        setError(error.message ?? String(error));
        return;
      }

      if (data?.url) {
        // navigate to the oauth URL to begin the flow
        window.location.href = data.url;
      } else {
        // No URL returned — show the raw data for debugging
        setError(`No redirect URL returned. Response: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 Auth Debugger</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          ❌ Error: {error}
        </div>
      )}
      
      {session ? (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p>✅ Logged in as: <strong>{session.user.email}</strong></p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded mt-2">
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p>❌ Not logged in</p>
          <button onClick={handleGoogleLogin} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
            Sign in with Google
          </button>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded mt-4">
        <h3 className="font-bold mb-2">Supabase Config Check:</h3>
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>
    </div>
  );
}