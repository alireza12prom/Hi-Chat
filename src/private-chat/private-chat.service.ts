import { GatewayException } from '../common/error';
import {
  PrivateChatMessageRepository,
  PrivateChatRepository,
  UserRepository,
} from './repository';

import {
  CreateChatDto,
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

  async sendMessage(clientId: string, input: SendMessageDto) {
    const isChatExists = await this.privateChatRepo.existsByChatId(input.chatId);
    if (!isChatExists) {
      throw new GatewayException("chat didn't find");
    }

    // create a new message
    return await this.privateChatMessageRepo.create({
      userId: clientId,
      ...input,
    });
  }

  async deleteMessage(clientId: string, input: DeleteMessageDto) {
    const deletedMessage = await this.privateChatMessageRepo.delete({
      userId: clientId,
      ...input,
    });

    if (!deletedMessage) {
      throw new GatewayException("message didn't find");
    }
    return deletedMessage;
  }

  async updateMessage(clientId: string, input: UpdateMessageDto) {
    const updatedMessage = await this.privateChatMessageRepo.updateOne({
      userId: clientId,
      ...input,
    });

    if (!updatedMessage) {
      throw new GatewayException("message didn't find");
    }
    return updatedMessage;
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
