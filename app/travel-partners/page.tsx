'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function TravelPartnersPage() {
  const { user } = useAuth();
  const [trainNumber, setTrainNumber] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchTravelers = async () => {
    if (!trainNumber) {
      alert('Please enter a train number');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // First, get the train details to verify it exists
      const trainRes = await fetch(`/api/train?number=${trainNumber}`);
      const trainData = await trainRes.json();
      
      if (trainData.error) {
        alert(`Train ${trainNumber} not found. Try: 12627, 12951, or 12301`);
        setTravelers([]);
        setLoading(false);
        return;
      }

      // Fetch REAL journeys from database
      const { data: journeys, error } = await supabase
        .from('journeys')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            interests
          )
        `)
        .eq('train_number', trainNumber);

      if (error) throw error;

      if (journeys && journeys.length > 0) {
        // Transform real data
        const realTravelers = journeys.map((journey: any) => ({
          id: journey.id,
          journeyId: journey.id,
          name: journey.profiles?.full_name || 'Anonymous',
          from: journey.from_station,
          to: journey.to_station,
          date: journey.travel_date,
          interests: journey.profiles?.interests || [],
          avatar: journey.profiles?.avatar_url,
        }));
        setTravelers(realTravelers);
      } else {
        // Show mock data if no real journeys
        setTravelers([
          {
            id: 1,
            journeyId: 'sample-1',
            name: 'Rahul Sharma (Sample)',
            from: 'Bangalore SBC',
            to: 'New Delhi NDLS',
            interests: ['Books', 'Music', 'Travel'],
            date: travelDate || 'Today'
          },
          {
            id: 2,
            journeyId: 'sample-2',
            name: 'Priya Patel (Sample)',
            from: 'Bangalore SBC',
            to: 'New Delhi NDLS',
            interests: ['Food', 'Photography'],
            date: travelDate || 'Today'
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to find travelers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">👥 Find Travel Partners</h1>
      
      {/* Search Form */}
      <div className="card mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Train Number</label>
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="e.g., 12627, 12951, 12301"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Try: 12627 (Karnataka Express), 12951 (Mumbai Rajdhani)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Travel Date (Optional)</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          <button 
            onClick={searchTravelers}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Searching...' : 'Find Travel Partners'}
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">🔍</div>
              <p>Searching for travelers...</p>
            </div>
          ) : travelers.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                🎉 {travelers.length} Traveler(s) on Train {trainNumber}
              </h2>
              
              {travelers.map((traveler) => (
                <div key={traveler.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                        {traveler.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{traveler.name}</h3>
                        <p className="text-sm text-gray-600">
                          {traveler.from} → {traveler.to}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          📅 {traveler.date}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {traveler.interests.map((interest: string) => (
                            <span key={interest} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* CHAT BUTTON - This is the updated part */}
                    {user ? (
                      <a 
                        href={`/chat/${traveler.journeyId}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm inline-block"
                      >
                        💬 Chat
                      </a>
                    ) : (
                      <a 
                        href="/login" 
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm inline-block"
                      >
                        Login to Chat
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-lg mb-2">🚂 No travelers found for Train {trainNumber}</p>
              <p className="text-gray-600 mb-4">Be the first to create a journey!</p>
              <a href="/create-journey" className="btn-primary inline-block">
                ✨ Create Your Journey
              </a>
            </div>
          )}
        </>
      )}

      {/* Create Journey Button */}
      <div className="mt-8 text-center pt-8 border-t">
        <p className="text-gray-600 mb-3">Want to find travel partners?</p>
        <a href="/create-journey" className="btn-secondary">
          ✨ Create Your Journey
        </a>
      </div>
    </div>
  );
}