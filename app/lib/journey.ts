import { supabase } from './supabaseClient';

export interface Journey {
  id: string;
  user_id: string;
  train_number: string;
  travel_date: string;
  from_station: string;
  to_station: string;
  created_at: string;
}

export interface JourneyWithUser extends Journey {
  profiles: {
    full_name: string;
    avatar_url: string;
    interests: string[];
  };
}

// Create a new journey
export async function createJourney(
  trainNumber: string,
  travelDate: string,
  fromStation: string,
  toStation: string
) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('journeys')
    .insert({
      user_id: userData.user.id,
      train_number: trainNumber,
      travel_date: travelDate,
      from_station: fromStation,
      to_station: toStation,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all journeys for a specific train
export async function getJourneysByTrain(trainNumber: string, travelDate: string) {
  const { data, error } = await supabase
    .from('journeys')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        interests
      )
    `)
    .eq('train_number', trainNumber)
    .eq('travel_date', travelDate);

  if (error) throw error;
  return data as JourneyWithUser[];
}

// Join a journey (add yourself as participant)
export async function joinJourney(journeyId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('journey_participants')
    .insert({
      journey_id: journeyId,
      user_id: userData.user.id,
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get participants for a journey
export async function getJourneyParticipants(journeyId: string) {
  const { data, error } = await supabase
    .from('journey_participants')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        interests
      )
    `)
    .eq('journey_id', journeyId);

  if (error) throw error;
  return data;
}
// ============ CHAT FUNCTIONS ============

export interface Message {
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

// Send a message to a journey
export async function sendMessage(journeyId: string, messageText: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      journey_id: journeyId,
      sender_id: userData.user.id,
      message: messageText,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all messages for a journey
export async function getMessages(journeyId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

// Subscribe to new messages (real-time)
export function subscribeToMessages(
  journeyId: string, 
  onNewMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${journeyId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `journey_id=eq.${journeyId}`,
      },
      async (payload) => {
        // Fetch the full message with profile info
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) onNewMessage(data);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Get all journeys the user is part of
export async function getUserJourneys() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from('journey_participants')
    .select(`
      journey_id,
      journeys (
        id,
        train_number,
        travel_date,
        from_station,
        to_station
      )
    `)
    .eq('user_id', userData.user.id);

  if (error) return [];
  return data.map(item => item.journeys).filter(j => j !== null);
}