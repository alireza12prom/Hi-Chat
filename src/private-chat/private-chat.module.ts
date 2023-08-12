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
      await this._joinToPrivataChats(socket);
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

      // add two clients to the new chat
      await Promise.all([
        this._findSocketInstance(input.userId)?.join(result.id),
        socket.join(result.id),
      ]);

      // emit to both clients, the new chat
      this.io.in(result.id).emit(ActiveEvents.createChat, {
        status: 'success',
        value: result,
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

  private async onSendMessage(socket: socket.Socket, input: SendMessageDto) {
    try {
      const result = await this.service.sendMessage(socket.data.userId, input);
      socket.in(input.chatId).emit(ActiveEvents.sendMessage, result);
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

      socket.in(input.chatId).emit(ActiveEvents.deleteMessage, {
        messageId: result._id,
        chatId: result.chatId,
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

      socket.in(input.chatId).emit(ActiveEvents.updateMessage, {
        messageId: result._id,
        chatId: result.chatId,
        body: result.body,
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

  private _findSocketInstance(userId: string): socket.Socket | undefined {
    for (let ins of this.io.sockets.values()) {
      if (ins.data.userId == userId) return ins;
    }
  }

  private async _joinToPrivataChats(socket: socket.Socket) {
    const chats = await this.service.clinetChats(socket.data.userId);

    for (let chat of chats) {
      socket.join(chat._id.toString());
    }

    socket.emit(ActiveEvents.joinedChats, chats);
  }
}
