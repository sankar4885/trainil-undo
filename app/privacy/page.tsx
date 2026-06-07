'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function PrivacyPage() {
  const { user } = useAuth();
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('privacy_settings')
      .eq('id', user?.id)
      .single();
    
    if (data?.privacy_settings) {
      setShowEmail(data.privacy_settings.show_email || true);
      setShowPhone(data.privacy_settings.show_phone || false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        privacy_settings: {
          show_email: showEmail,
          show_phone: showPhone,
        }
      })
      .eq('id', user?.id);

    if (error) {
      alert('Error saving settings');
    } else {
      alert('Settings saved!');
    }
    setLoading(false);
  };

  if (!user) return <div className="p-8">Please login</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Settings</h1>
      
      <div className="card space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Visibility</h2>
          
          <label className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Show Email</p>
              <p className="text-sm text-gray-500">Allow others to see your email</p>
            </div>
            <input
              type="checkbox"
              checked={showEmail}
              onChange={(e) => setShowEmail(e.target.checked)}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Show Phone</p>
              <p className="text-sm text-gray-500">Allow others to see your phone number</p>
            </div>
            <input
              type="checkbox"
              checked={showPhone}
              onChange={(e) => setShowPhone(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            🔒 Your privacy matters. We never share your personal information without consent.
            Reported users are reviewed within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}