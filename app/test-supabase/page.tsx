'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function test() {
      try {
        // Test if we can connect to Supabase
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
          setStatus('❌ Error: ' + error.message);
        } else {
          setStatus('✅ Supabase is connected!');
        }
      } catch (err: any) {
        setStatus('❌ Connection failed: ' + err.message);
      }
    }
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="card">
        <p>{status}</p>
        <p className="text-xs text-gray-500 mt-4">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}
        </p>
      </div>
    </div>
  );
}