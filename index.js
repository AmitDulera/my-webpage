const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Gemini Backend Service is Running!');
});

// Endpoint for Flutter App
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Using gemini-1.5-flash for fast response
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ success: true, text: text });
    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to process request with Gemini API',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
