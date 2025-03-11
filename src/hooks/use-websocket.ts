"use client"

import { io } from 'socket.io-client'


export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

export const requestPrivateCallAccess = (data: {username: string, roomId: string, userId: string}) => {
  socket?.emit('requestPrivateCallAccess', data)
}

export const joinRoom = (roomId: string) => {
  socket?.emit('joinRoom', roomId)
}
