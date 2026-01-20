const axios = require('axios');

// Placeholder wrapper for Bhashini API
const translateText = async (text, sourceLang, targetLang) => {
  try {
    // NOTE: This URL and payload structure are conceptual. 
    // You must refer to the official Bhashini dashboard for your specific pipeline ID.
    const response = await axios.post('https://dhruva-api.bhashini.gov.in/services/inference/translation', {
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
        "input": [{ "source": text }]
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BHASHINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.pipelineResponse[0].output[0].target;
  } catch (error) {
    console.error("Bhashini Error:", error.message);
    return text; // Fallback to original text if translation fails
  }
};

module.exports = { translateText };