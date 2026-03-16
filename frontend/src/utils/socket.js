import { io } from 'socket.io-client';

// Connect to the backend Socket.io server
const getSocketURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    // In production (unified deploy), connect to the same origin
    return window.location.origin;
  }
  // In dev, strip '/api' from VITE_API_URL to get the base server URL
  return envUrl.replace(/\/api\/?$/, '');
};

const socket = io(getSocketURL(), {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
