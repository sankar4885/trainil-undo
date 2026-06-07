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