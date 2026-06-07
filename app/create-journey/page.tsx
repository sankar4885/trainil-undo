'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { createJourney } from '../lib/journey';

export default function CreateJourneyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [trainNumber, setTrainNumber] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createJourney(trainNumber, travelDate, fromStation, toStation);
      alert('Journey created successfully!');
      router.push(`/search?train=${trainNumber}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Create a Journey</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Train Number *</label>
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="e.g., 12627"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Travel Date *</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From Station *</label>
            <input
              type="text"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              placeholder="e.g., Bangalore SBC"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To Station *</label>
            <input
              type="text"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              placeholder="e.g., New Delhi NDLS"
              className="input-field"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              ❌ {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Journey'}
          </button>
        </form>
      </div>
    </div>
  );
}