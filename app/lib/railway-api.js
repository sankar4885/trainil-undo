import { configure, trackTrain, getTrainInfo } from 'irctc-connect';

// Configure with your API key
const apiKey = process.env.IRCTC_API_KEY;

if (!apiKey) {
  console.error('⚠️ IRCTC_API_KEY is missing!');
} else {
  configure(apiKey);
  console.log('✅ IRCTC API configured');
}

export { trackTrain, getTrainInfo };