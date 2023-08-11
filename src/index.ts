import './db';

// -------- express
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

httpServer.listen(parseInt(process.env.SERVER_PORT), () => {
  console.log('server started: http://localhost:3000');
});

// --- private chat apis
import { PrivateChatApiModule, privateChatApiService } from './private-chat-api';
new PrivateChatApiModule(app, privateChatApiService).init();

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
