const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables. If you are on Render, please set it in the Dashboard.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Provide a helpful hint for "Invalid scheme" errors
    if (error.message.includes('Invalid scheme')) {
      console.warn('HINT: Your MONGO_URI might be empty or malformed. Ensure it starts with "mongodb://" or "mongodb+srv://"');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
