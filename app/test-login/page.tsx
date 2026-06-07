'use client';

import { supabase } from '../lib/supabaseClient';

export default function TestLogin() {
  const testLogin = async () => {
    // Create a test session without real Google
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456',
    });
    
    if (error) {
      console.error('Error:', error);
      alert('Login failed: ' + error.message);
    } else {
      alert('Test user created! You can now login with email test@example.com');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Login</h1>
      <button onClick={testLogin} className="btn-primary w-full">
        Create Test Account
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Then login with email: test@example.com, password: test123456
      </p>
    </div>
  );
}