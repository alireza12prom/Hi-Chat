import socket from 'socket.io';
import { TokenTypes } from '../common/constant';
import { GatewayException } from '../common/error';
import { BaseSocketGateway } from '../common/base';
import { PrivateChatService } from './private-chat.service';

import {
  DeleteMessageSchema,
  SendMessageDto,
  SendMessageSchema,
  UpdateMessageDto,
  DeleteMessageDto,
  UpdateMessageSchema,
  CreateChatDto,
  CreateChatSchema,
} from './dto';

import {
  socketAuthorizationMiddleware,
  validateSocketBody,
} from '../common/middleware';

enum ActiveEvents {
  createChat = 'create-chat',
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
      // await this._joinToPrivataChats(socket);
      socket.join(socket.data.userId);
    });

    this.io.on('connection', (socket) => {
      socket.on(
        ActiveEvents.createChat,
        validateSocketBody(socket, CreateChatSchema, this.onCreateChat.bind(this)),
      );

      socket.on(
        ActiveEvents.sendMessage,
        validateSocketBody(socket, SendMessageSchema, this.onSendMessage.bind(this)),
      );

      socket.on(
        ActiveEvents.deleteMessage,
        validateSocketBody(
          socket,
          DeleteMessageSchema,
          this.onDeleteMessage.bind(this),
        ),
      );

      socket.on(
        ActiveEvents.updateMessage,
        validateSocketBody(
          socket,
          UpdateMessageSchema,
          this.onUpdateMessage.bind(this),
        ),
      );
    });
  }

  private async onCreateChat(socket: socket.Socket, input: CreateChatDto) {
    try {
      const result = await this.service.createChat(socket.data.userId, input);
      const response = { status: 'success', value: result };

      // emit response to both clients, the new chat
      socket.emit(ActiveEvents.createChat, response);
      socket.in(input.userId).emit(ActiveEvents.createChat, response);
    } catch (error) {
      let message: string;

      if (error instanceof GatewayException) {
        message = error.message;
      } else {
        message = 'something went wrong';
      }

      socket.emit(ActiveEvents.createChat, {
        status: 'faild',
        value: message,
      });
    }
  }

  private async onSendMessage(socket: socket.Socket, input: SendMessageDto) {
    try {
      const result = await this.service.sendMessage(socket.data.userId, input);
      socket.in(result.to).emit(ActiveEvents.sendMessage, result.message);
    } catch (error) {
      let message: string;

      if (error instanceof GatewayException) {
        message = error.message;
      } else {
        message = 'something went wrong';
      }

      socket.emit(ActiveEvents.createChat, {
        status: 'faild',
        value: message,
      });
    }
  }

  private async onDeleteMessage(socket: socket.Socket, input: DeleteMessageDto) {
    try {
      const result = await this.service.deleteMessage(socket.data.userId, input);

      socket.in(result.targetId).emit(ActiveEvents.deleteMessage, {
        messageId: input.messageId,
        chatId: input.chatId,
      });
    } catch (error) {
      let message: string;

      if (error instanceof GatewayException) {
        message = error.message;
      } else {
        message = 'something went wrong';
      }

      socket.emit(ActiveEvents.createChat, {
        status: 'faild',
        value: message,
      });
    }
  }

  private async onUpdateMessage(socket: socket.Socket, input: UpdateMessageDto) {
    try {
      const result = await this.service.updateMessage(socket.data.userId, input);
      socket.in(result.targetId).emit(ActiveEvents.updateMessage, result.message);
    } catch (error) {
      let message: string;

      if (error instanceof GatewayException) {
        message = error.message;
      } else {
        message = 'something went wrong';
      }

      socket.emit(ActiveEvents.createChat, {
        status: 'faild',
        value: message,
      });
    }
  }
}
