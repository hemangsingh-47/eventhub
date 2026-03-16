// Socket.io event room handlers
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join an event room to receive real-time updates
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
    });

    // Leave an event room
    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocketHandlers };
