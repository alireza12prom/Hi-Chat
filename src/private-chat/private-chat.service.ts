import { GatewayException } from '../common/error';

import {
  PrivateChatMessageRepository,
  PrivateChatRepository,
  UserRepository,
} from './repository';

import {
  CreateChatDto,
  DeleteChatDto,
  DeleteMessageDto,
  SendMessageDto,
  UpdateMessageDto,
} from './dto';

export class PrivateChatService {
  constructor(
    private userRepo: UserRepository,
    private privateChatRepo: PrivateChatRepository,
    private privateChatMessageRepo: PrivateChatMessageRepository,
  ) {}

  async clinetChats(clientId: string) {
    return await this.privateChatRepo.getAll(clientId);
  }

  async createChat(clientId: string, input: CreateChatDto) {
    const isUserExists = await this.userRepo.existsById(input.userId);
    if (!isUserExists) {
      throw new GatewayException("user didn't find");
    }

    // check has any chat opened before
    const hasChatOpened = await this.privateChatRepo.existsByMembers({
      members: [clientId, input.userId],
    });
    if (hasChatOpened) {
      throw new GatewayException('the chat has already opened');
    }

    // create a new chat
    return await this.privateChatRepo.create({
      members: [clientId, input.userId],
    });
  }

  async deleteChat(clientId: string, input: DeleteChatDto) {
    const chat = await this.existsInChat(input.chatId, clientId);

    // delete chat & messages
    await Promise.all([
      this.privateChatRepo.deleteOne(input.chatId),
      this.privateChatMessageRepo.deleteMessages(input.chatId),
    ]);

    const targetId = chat.members
      .filter((v) => v.toString() != clientId)[0]
      .toString();
    return { targetId };
  }

  async sendMessage(clientId: string, input: SendMessageDto) {
    const chat = await this.existsInChat(input.chatId, clientId);

    // create a new message
    const message = await this.privateChatMessageRepo.create({
      userId: clientId,
      ...input,
    });

    const to = chat.members.filter((v) => v.toString() != clientId)[0].toString();
    return { message, from: clientId, to };
  }

  async deleteMessage(clientId: string, input: DeleteMessageDto) {
    const chat = await this.existsInChat(input.chatId, clientId);

    // delete message
    const deletedMessage = await this.privateChatMessageRepo.delete({
      userId: clientId,
      ...input,
    });
    if (!deletedMessage) {
      throw new GatewayException("message didn't find");
    }

    const targetId = chat.members
      .filter((v) => v.toString() != clientId)[0]
      .toString();
    return { targetId };
  }

  async updateMessage(clientId: string, input: UpdateMessageDto) {
    const chat = await this.existsInChat(input.chatId, clientId);

    // update message
    const updatedMessage = await this.privateChatMessageRepo.updateOne({
      userId: clientId,
      ...input,
    });
    if (!updatedMessage) {
      throw new GatewayException("message didn't find");
    }

    const targetId = chat.members
      .filter((v) => v.toString() != clientId)[0]
      .toString();
    return { targetId, message: updatedMessage };
  }

  private async existsInChat(chatId: string, userId: string) {
    // check client exists in the chat
    const chat = await this.privateChatRepo.find({ chatId, userId });
    if (!chat) {
      throw new GatewayException("chat didn't find");
    }
    return chat;
  }
}

// --- injecting repositories to the service
import { UserModel, PrivateChatModel, PrivateChatMessageModel } from '../db/models';

// --- repositories
const userRepo = new UserRepository(UserModel);
const privateChatRepo = new PrivateChatRepository(PrivateChatModel);
const privateChatMessageRepo = new PrivateChatMessageRepository(
  PrivateChatMessageModel,
);

// --- service
export const privateChatService = new PrivateChatService(
  userRepo,
  privateChatRepo,
  privateChatMessageRepo,
);
