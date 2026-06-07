'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface Message {
  id: string;
  journey_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export default function ChatPage() {
  const { journeyId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load messages
  useEffect(() => {
    if (!journeyId || !user) return;

    async function loadMessages() {
      try {
        // Simple query without join first to test
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('journey_id', journeyId)
          .order('created_at', { ascending: true });

        if (error) {
          console.log('Messages table might not have data yet');
          setMessages([]);
        } else {
          setMessages(data || []);
        }
      } catch (err) {
        // Silently ignore - table might be empty
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();

    // Simple subscription
    const subscription = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `journey_id=eq.${journeyId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [journeyId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          journey_id: journeyId,
          sender_id: user.id,
          message: newMessage.trim(),
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Send error:', error);
        alert('Failed to send message. Please try again.');
      } else {
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong');
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-2xl mb-2">💬</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-train-primary text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">💬 Journey Chat</h1>
        <p className="text-sm opacity-90">Chat with your co-travelers</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm mt-2">Be the first to say hello to your co-travelers!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-train-primary text-white'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 text-train-primary">
                      {msg.sender_id === user?.id ? 'You' : 'Traveler'}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-train-primary"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-train-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}