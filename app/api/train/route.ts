import { NextRequest, NextResponse } from 'next/server';
import { trackTrain, getTrainInfo } from '../../lib/railway-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trainNumber = searchParams.get('number');

  if (!trainNumber) {
    return NextResponse.json(
      { error: 'Train number is required' },
      { status: 400 }
    );
  }

  try {
    // Try to get real-time data from IRCTC API
    const trackResult = await trackTrain(trainNumber);
    
    if (trackResult.success && trackResult.data) {
      const { trainNo, trainName, statusNote, currentStationCode, timeline } = trackResult.data;
      
      // Get schedule information
      const trainInfoResult = await getTrainInfo(trainNumber);
      const route = trainInfoResult.success ? trainInfoResult.data.route : [];

      // Extract delay from status note
      let delay = 0;
      if (statusNote) {
        const delayMatch = statusNote.match(/delayed by (\d+)/i);
        if (delayMatch) delay = parseInt(delayMatch[1]);
      }

      // Format schedule for frontend
      const schedule = route.map((station: any) => ({
        station: `${station.stnName} (${station.stnCode})`,
        arrival: station.arrival !== '--' ? station.arrival : null,
        departure: station.departure !== '--' ? station.departure : null,
        status: station.stnCode === currentStationCode ? '📍 Current Location' : 'Scheduled'
      }));

      return NextResponse.json({
        number: trainNo,
        name: trainName,
        status: 'Running',
        currentLocation: currentStationCode || 'Unknown',
        delay: delay,
        schedule: schedule,
        lastUpdated: new Date().toISOString(),
        liveStatus: statusNote
      });
    } else {
      throw new Error(trackResult.error || 'Train not found');
    }
    
  }    catch (error: any) {
    // --- THIS IS THE MODIFIED ERROR HANDLER ---
    console.error('🔥 API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    // --- End of Error Handler ---

    // Fallback to mock data
    return getMockData(trainNumber);
  }
}

// Mock data for backup
function getMockData(trainNumber: string) {
  const mockData: Record<string, any> = {
    '12627': {
      number: '12627',
      name: 'KARNATAKA EXPRESS',
      status: 'Running',
      currentLocation: 'Dharmavaram Junction',
      delay: 15,
      schedule: [
        { station: 'Bangalore SBC', arrival: '20:00', departure: '20:15', status: 'On Time' },
        { station: 'Dharmavaram DMM', arrival: '23:30', departure: '23:32', status: 'Delayed by 15 min' },
        { station: 'New Delhi NDLS', arrival: '20:30', departure: null, status: 'Running' },
      ],
      lastUpdated: new Date().toISOString(),
    },
    '12951': {
      number: '12951',
      name: 'MUMBAI RAJDHANI',
      status: 'On Time',
      currentLocation: 'Kota Junction',
      delay: 0,
      schedule: [
        { station: 'Mumbai Central MMCT', arrival: '16:35', departure: '16:55', status: 'On Time' },
        { station: 'Kota KOTA', arrival: '04:00', departure: '04:10', status: 'On Time' },
        { station: 'New Delhi NDLS', arrival: '08:30', departure: null, status: 'On Time' },
      ],
      lastUpdated: new Date().toISOString(),
    },
    '12301': {
      number: '12301',
      name: 'HOWRAH RAJDHANI',
      status: 'Running',
      currentLocation: 'Dhanbad Junction',
      delay: 45,
      schedule: [
        { station: 'Howrah HWH', arrival: '13:05', departure: '13:20', status: 'On Time' },
        { station: 'Dhanbad DHN', arrival: '17:10', departure: '17:15', status: 'Delayed by 45 min' },
        { station: 'New Delhi NDLS', arrival: '22:30', departure: null, status: 'Running' },
      ],
      lastUpdated: new Date().toISOString(),
    },
  };

  const train = mockData[trainNumber];
  if (train) {
    return NextResponse.json(train);
  }
  
  return NextResponse.json(
    { error: `Train ${trainNumber} not found. Try: 12627, 12951, or 12301` },
    { status: 404 }
  );
}