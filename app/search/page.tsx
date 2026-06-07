'use client';

import { useState } from 'react';

interface TrainSchedule {
  station: string;
  arrival: string | null;
  departure: string | null;
  status: string;
}

interface TrainData {
  number: string;
  name: string;
  status: string;
  currentLocation: string;
  delay: number;
  schedule: TrainSchedule[];
  lastUpdated: string;
}

export default function SearchPage() {
  const [trainNumber, setTrainNumber] = useState('');
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrainData(null);

    try {
      const response = await fetch(`/api/train?number=${trainNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Train not found');
      }

      setTrainData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay === 0) return 'text-green-600';
    if (delay <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Search Trains</h1>
      
      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={searchTrain} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Train Number</label>
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="e.g., 12627, 12951, 12301"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Try: 12627 (Karnataka Express), 12951 (Mumbai Rajdhani), or 12301 (Howrah Rajdhani)
            </p>
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Check Train Status'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-2xl mb-2">🔄</div>
          <p>Fetching train status...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ {error}
        </div>
      )}

      {/* Train Results */}
      {trainData && (
        <div className="space-y-6">
          {/* Train Header */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{trainData.name}</h2>
                <p className="text-gray-600">Train #{trainData.number}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getDelayColor(trainData.delay)}`}>
                  {trainData.delay === 0 ? 'On Time' : `Delayed by ${trainData.delay} min`}
                </div>
                <p className="text-sm text-gray-500">Updated: {new Date(trainData.lastUpdated).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">📍 Current Status</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{trainData.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">{trainData.currentLocation}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">📅 Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Station</th>
                    <th className="text-left py-2">Arrival</th>
                    <th className="text-left py-2">Departure</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trainData.schedule.map((station, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2 font-medium">{station.station}</td>
                      <td className="py-2">{station.arrival || '-'}</td>
                      <td className="py-2">{station.departure || '-'}</td>
                      <td className="py-2">
                        <span className={`text-sm ${
                          station.status.includes('On Time') ? 'text-green-600' :
                          station.status.includes('Delayed') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {station.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Journey Button */}
          <div className="text-center">
            <button className="btn-primary px-8 py-3 text-lg">
              ✨ Create Journey on this Train
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Create a journey to find travel partners on this train
            </p>
          </div>
        </div>
      )}
    </div>
  );
}