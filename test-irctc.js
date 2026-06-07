// test-irctc.js - Place this file in your project root folder

import { configure, trackTrain } from './app/lib/railway-api.js';

// Your API key
const API_KEY = 'irctc_f0e0bedf1cdefb3eee7cc356c91711f7bac8e1abd5602980';

// Configure the API
configure(API_KEY);

// Test train number
const testTrainNumber = '12301';

async function testAPI() {
  console.log(`🔍 Testing live status for train ${testTrainNumber}...`);
  
  try {
    const result = await trackTrain(testTrainNumber);
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`Train Name: ${result.data.trainName}`);
      console.log(`Train Number: ${result.data.trainNo}`);
      console.log(`Status: ${result.data.statusNote}`);
      console.log(`Current Station: ${result.data.currentStationCode}`);
      console.log(`Full Response:`, JSON.stringify(result.data, null, 2));
    } else {
      console.error('❌ API Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

testAPI();