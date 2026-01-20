const axios = require('axios');

// This is a placeholder. You need to get actual credentials and endpoint URLs from the Bhashini platform.
const BHASHINI_API_URL = 'https://bhashini.gov.in/api/v1/translate'; 
const BHASHINI_API_KEY = process.env.BHASHINI_API_KEY;

const translateText = async (text, sourceLang, targetLang) => {
  try {
    // Construct the request payload according to Bhashini's API documentation
    const payload = {
      "pipelineTasks": [
        {
          "taskType": "translation",
          "config": {
            "language": {
              "sourceLanguage": sourceLang,
              "targetLanguage": targetLang
            }
          }
        }
      ],
      "inputData": {
        "input": [
          {
            "source": text
          }
        ]
      }
    };

    const response = await axios.post(BHASHINI_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${BHASHINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the translated text from the response
    const translatedText = response.data.pipelineResponse[0].output[0].target;
    return translatedText;
  } catch (error) {
    console.error('Error translating text with Bhashini:', error);
    throw error;
  }
};

module.exports = { translateText };