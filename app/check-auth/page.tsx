'use client';

import { useAuth } from '../context/AuthContext';

export default function CheckAuth() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Status</h1>
      {user ? (
        <div className="bg-green-100 p-4 rounded">
          ✅ Logged in as: {user.email}
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          ❌ Not logged in. <a href="/login" className="text-blue-600 underline">Login here</a>
        </div>
      )}
    </div>
  );
}