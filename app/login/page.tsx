'use client';

import LoginButton from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in with Google to continue your journey
        </p>
        <LoginButton />
        <p className="text-xs text-center text-gray-500 mt-6">
          By signing in, you agree to our Community Guidelines
        </p>
      </div>
    </div>
  );
}