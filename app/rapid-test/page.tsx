'use client';

import { useState } from 'react';

export default function RapidTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trainNumber, setTrainNumber] = useState('12627');

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/train?number=${trainNumber}`);
      const data = await response.json();
      setResult(data);
      console.log('API Result:', data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch' });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RapidAPI Test</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Train number"
        />
        <button
          onClick={testAPI}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Test API
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded overflow-auto">
          <pre className="text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}