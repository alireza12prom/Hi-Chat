import socket from 'socket.io';
import { TokenTypes } from '../common/constant';
import { BaseSocketGateway } from '../common/base';
import { PrivateChatService } from './private-chat.service';

import {
  DeleteMessageSchema,
  SendMessageSchema,
  UpdateMessageSchema,
  CreateChatSchema,
  DeleteChatSchema,
} from './dto';

import {
  gatewayWrapper,
  socketAuthorizationMiddleware,
  validateSocketBody,
} from '../common/middleware';

enum ActiveEvents {
  createChat = 'create-chat',
  deleteChat = 'delete-caht',
  sendMessage = 'send-message',
  deleteMessage = 'delete-message',
  updateMessage = 'update-message',
  joinedChats = 'joined-chats',
}

export class PrivateChatModule extends BaseSocketGateway {
  constructor(protected io: socket.Namespace, private service: PrivateChatService) {
    super(io);
  }

  init() {
    this.io.on('connect', async (socket) => {
      await socketAuthorizationMiddleware(TokenTypes.ACCESS_TOKEN, socket);
      socket.join(socket.data.userId);
    });

    this.io.on('connection', (socket) => {
      socket.on(
        ActiveEvents.createChat,
        gatewayWrapper(socket, this.onCreateChat.bind(this)),
      );

      socket.on(
        ActiveEvents.sendMessage,
        gatewayWrapper(socket, this.onSendMessage.bind(this)),
      );

      socket.on(
        ActiveEvents.deleteMessage,
        gatewayWrapper(socket, this.onDeleteMessage.bind(this)),
      );

      socket.on(
        ActiveEvents.updateMessage,
        gatewayWrapper(socket, this.onUpdateMessage.bind(this)),
      );

      socket.on(
        ActiveEvents.deleteChat,
        gatewayWrapper(socket, this.onDeleteChat.bind(this)),
      );
    });
  }

  private async onCreateChat(socket: socket.Socket, arg: any) {
    const input = validateSocketBody(arg, CreateChatSchema);
    const result = await this.service.createChat(socket.data.userId, input);

    // emit response to both clients, the new chat
    const response = { status: 'success', value: result };
    socket.emit(ActiveEvents.createChat, response);
    socket.in(input.userId).emit(ActiveEvents.createChat, response);
  }

  private async onDeleteChat(socket: socket.Socket, arg: any) {
    const input = validateSocketBody(arg, DeleteChatSchema);
    const result = await this.service.deleteChat(socket.data.userId, input);
    socket
      .in(result.targetId)
      .emit(ActiveEvents.deleteChat, { chatId: input.chatId });
  }

  private async onSendMessage(socket: socket.Socket, arg: any) {
    const input = validateSocketBody(arg, SendMessageSchema);
    const result = await this.service.sendMessage(socket.data.userId, input);
    socket.in(result.to).emit(ActiveEvents.sendMessage, result.message);
  }

  private async onDeleteMessage(socket: socket.Socket, arg: any) {
    const input = validateSocketBody(arg, DeleteMessageSchema);
    const result = await this.service.deleteMessage(socket.data.userId, input);
    socket.in(result.targetId).emit(ActiveEvents.deleteMessage, {
      messageId: input.messageId,
      chatId: input.chatId,
    });
  }

  private async onUpdateMessage(socket: socket.Socket, arg: any) {
    const input = validateSocketBody(arg, UpdateMessageSchema);
    const result = await this.service.updateMessage(socket.data.userId, input);
    socket.in(result.targetId).emit(ActiveEvents.updateMessage, result.message);
  }
}
