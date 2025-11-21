/**
 * Socket.IO configuration for real-time updates
 */

import io, { Socket } from 'socket.io-client'

const SOCKET_URL = 'https://nestjs-heyama-api-test.onrender.com'

let socket: Socket | null = null

export const initSocket = (): Socket => {
  if (socket) {
    return socket
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    autoConnect: true,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false
}

export default {
  initSocket,
  getSocket,
  closeSocket,
  isSocketConnected,
}
