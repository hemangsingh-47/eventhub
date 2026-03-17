require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('./jobs/reminderCron'); // Start cron jobs
const { setupSocketHandlers } = require('./socket/handlers');

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io to every request so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiter for auth routes (max 20 req / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Initialize Socket.io room handlers
setupSocketHandlers(io);

// 404 catch-all for unknown API routes
app.all(/\/api\/.*/, (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Static files for production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (with Socket.io)`));