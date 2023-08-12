import './db';

// -------- express
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

// -- global middlewares
app.use(express.json());

const PORT = parseInt(process.env.SERVER_PORT);
httpServer.listen(PORT, () => {
  console.log(`server started: http://localhost:${PORT}`);
});

// --- private chat routes
import { PrivateChatApiModule, privateChatApiService } from './private-chat-api';
new PrivateChatApiModule(app, privateChatApiService).init();

// --- auth routes
import { AuthModule, authService, verifyEmailService } from './auth';
new AuthModule(app, authService, verifyEmailService).init();

// --- profile routes
import { ProfileModule, profileService } from './profile';
new ProfileModule(app, profileService).init();

// -------- socket
import socket from 'socket.io';
const io = new socket.Server(httpServer, {});

// --- private chat sockets
import { PrivateChatModule, privateChatService } from './private-chat';
new PrivateChatModule(io.of('private-chat'), privateChatService).init();
