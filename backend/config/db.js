const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error('MONGO_URI is missing. Please set it in Render Dashboard -> Environment.');
    }

    // Diagnostic log (SAFE: only shows first few characters and length)
    console.log(`Debug: MONGO_URI exists. Length: ${uri.length}. Starts with: ${uri.substring(0, 10)}...`);

    const conn = await mongoose.connect(uri.trim()); // trim() helps if there are trailing spaces
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Specific hints for common Render issues
    if (error.message.includes('Invalid scheme')) {
      console.warn('HINT: Your MONGO_URI in Render might have invisible characters, quotes, or is not a valid mongodb+srv:// string.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
