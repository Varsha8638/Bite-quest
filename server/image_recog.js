


const GoogleAIFileManager = require('@google/generative-ai/server').GoogleAIFileManager;
const GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

async function recognizeFood(imageBuffer) {
  // Unique filename per request so concurrent uploads don't overwrite each other's temp file.
  const tempFilePath = path.join(__dirname, `temp-${crypto.randomUUID()}.jpg`);

  try {
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Upload the image
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: 'image/jpeg',
      displayName: 'Uploaded Food Image',
    });

    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    // Generate content based on the uploaded file
    const result = await model.generateContent([
      'Recognise the food image and tell me which of following cateogories it belongs to Continental, American, Asian, North Indian,Thai, European, Mexican,Italian,Mughlai,Chinese,South Indian,Bengali,Seafood,Pizza,Mediterranean,Desserts,Ice Cream.Only output the categories separated by commas.If it does not belong to any category output NOT AVAILABLE',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    console.log('API Response:', result); // Log the response
    return result.response.text();
  } catch (error) {
    console.error('Detailed Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to recognize food');
  } finally {
    // Clean up the temporary file even if something above threw
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

module.exports = { recognizeFood };

