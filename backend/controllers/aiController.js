const { GoogleGenerativeAI } = require("@google/generative-ai");
const Event = require("../models/Event");

// Initialize Gemini
console.log('Gemini API Key defined:', !!process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with AI about events
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    console.log('--- AI Chat Request ---');
    console.log('Message:', message);
    console.log('History length:', history ? history.length : 0);

    // 1. Fetch upcoming events to provide context to Gemini
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      availableSeats: { $gt: 0 }
    }).limit(10).select('title description date location category price');

    const eventContext = upcomingEvents.map(e => (
      `Event: ${e.title}, Category: ${e.category}, Price: ${e.price === 0 ? 'Free' : '$' + e.price}, Date: ${new Date(e.date).toLocaleDateString()}, Location: ${e.location}. Description: ${e.description}`
    )).join('\n');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are EventHub Assistant, a helpful AI for a college campus event platform. 
      Your goal is to help students find and understand events.
      
      Here are the upcoming events on campus:
      ${eventContext}
      
      Instructions:
      - Be friendly, enthusiastic, and concise.
      - If a user asks about events, recommend specific ones from the list above.
      - If they ask about a category (like Tech or Music), highlight relevant events.
      - If no events match, suggest they check back later or explore other categories.
      - Keep responses formatted in simple Markdown.`
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('--- Gemini AI Error Details ---');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    console.error('Stack:', error.stack);
    console.error('-------------------------------');
    res.status(500).json({ message: "AI assistant is currently unavailable." });
  }
};

module.exports = { chatWithAI };
