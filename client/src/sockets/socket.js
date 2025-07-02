import { io } from 'socket.io-client';

// Automatically pick server URL based on environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'], // optional: enforce WebSocket only
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
