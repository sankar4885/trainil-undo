'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
        ✅ Welcome, {user.user_metadata?.full_name || user.email}!
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">My Journeys</h2>
          <p className="text-gray-600">No active journeys. Search for a train to get started!</p>
          <button className="btn-primary mt-4">Create Journey</button>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Travel Partners</h2>
          <p className="text-gray-600">You'll see co-travelers here once you join a journey</p>
        </div>
      </div>
    </div>
  );
}