


const GoogleAIFileManager = require('@google/generative-ai/server').GoogleAIFileManager;
const GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;

const fs = require('fs');
const path = require('path');
// const { GoogleAIFileManager, GoogleGenerativeAI } = require('@google/generative-ai/server');

const apiKey = '';
const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function recognizeFood(imageBuffer) {
  try {
    // Define a path for the temporary file
    const tempFilePath = path.join(__dirname, 'temp_image.jpg');

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

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    console.log('API Response:', result); // Log the response
    return result.response.text();
  } catch (error) {
    console.error('Detailed Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to recognize food');
  }
}

module.exports = { recognizeFood };

