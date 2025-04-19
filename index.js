// Node.js backend server that handles the OpenAI API integration

// 1. Create a new directory for your backend:
// mkdir chat-backend
// cd chat-backend

// 2. Initialize a new Node.js project:
// npm init -y

// 3. Install required dependencies:
// npm install express cors dotenv openai

// 4. Create a .env file:
// OPENAI_API_KEY=your_openai_api_key_here
// PORT=3001
// ALLOWED_ORIGIN=http://localhost:3000

// 5. Create index.js file:

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can change this to gpt-3.5-turbo for lower cost
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Provide concise, informative responses."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const response = completion.choices[0].message.content;
    return res.json({ response });
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});