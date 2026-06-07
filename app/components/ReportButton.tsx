'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ReportButtonProps {
  reportedUserId: string;
  reportedUserName: string;
}

export default function ReportButton({ reportedUserId, reportedUserName }: ReportButtonProps) {
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async () => {
    if (!reason) {
      alert('Please select a reason');
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        alert('Please login to report');
        return;
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: userData.user.id,
          reported_user_id: reportedUserId,
          reason: reason,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      alert(`Reported ${reportedUserName}. Our team will review.`);
      setShowReport(false);
      setReason('');
    } catch (error) {
      console.error('Report error:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowReport(true)}
        className="text-red-600 text-xs hover:underline ml-2"
      >
        🚫 Report
      </button>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Report {reportedUserName}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Why are you reporting this user?
            </p>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">Select a reason</option>
              <option value="inappropriate">Inappropriate behavior</option>
              <option value="spam">Spam or advertising</option>
              <option value="harassment">Harassment</option>
              <option value="fake">Fake profile</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={submitReport}
                disabled={submitting}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={() => setShowReport(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}