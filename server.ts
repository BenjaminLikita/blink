import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
// import { WebSocketServer } from 'ws'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, turbo: true, conf: { reactStrictMode: true, 
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  } 
} })
const handle = app.getRequestHandler()

// Store active connections and meeting rooms
const clients = new Map()
const meetings = new Map()

// Initialize the app
app.prepare().then(() => {
  // Create HTTP server
  // const server = createServer((req, res) => {
  //   const parsedUrl = parse(req.url!, true)
  //   handle(req, res, parsedUrl)
  // })
  const server = createServer(handle)

  // Create WebSocket server
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {

    socket.on('requestPrivateCallAccess', (data: {username: string, roomId: string, userId: string}) => {
      const { username, roomId, userId } = data
      socket.to(roomId).emit("requestMessage", {username, roomId, userId})
    })
    
    socket.on('acceptedPrivateCallAccess', (data: {roomId: string, userId: string}) => {
      const { roomId, userId } = data
      socket.to(roomId).emit("acceptedPrivateCallAccess", {userId})
    })

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  })

  // Start the server
  server.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`)
  })
})