import './db';

// -------- express
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

// -- global middlewares
app.use(express.json());

httpServer.listen(parseInt(process.env.SERVER_PORT), () => {
  console.log('server started: http://localhost:3000');
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
import * as adminui from '@socket.io/admin-ui';

const io = new socket.Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

// enable admin ui
adminui.instrument(io, { auth: false });

// --- private chat sockets
import { PrivateChatModule, privateChatService } from './private-chat';
new PrivateChatModule(io.of('private-chat'), privateChatService).init();
