'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestDB() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        // First check if env variables are set
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
        }
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
        }
        
        setStatus('✅ Environment variables found! Testing database connection...');
        
        // Try to fetch from profiles table
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true });
        
        if (fetchError) {
          if (fetchError.message.includes('relation') && fetchError.message.includes('does not exist')) {
            setStatus('⚠️ Connected to Supabase! But "profiles" table not created yet. Run the SQL script in Supabase.');
          } else {
            throw fetchError;
          }
        } else {
          setStatus('✅ Fully connected to Supabase! Tables are ready.');
        }
      } catch (err: any) {
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      
      <div className={`card ${error ? 'border-red-300 bg-red-50' : 'border-green-300'}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            {status.includes('✅') ? '✅' : status.includes('❌') ? '❌' : status.includes('⚠️') ? '⚠️' : '🔄'}
          </div>
          <div>
            <p className="font-medium">{status}</p>
            {error && (
              <p className="text-red-600 text-sm mt-2">Error: {error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">📋 Current Status:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>Tables: Check Supabase dashboard</li>
        </ul>
      </div>
    </div>
  );
}