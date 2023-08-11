import { HttpException } from '../common/error';
import { GetChatMessagesDto } from './dto';
import { PrivateChatMessageRepository, PrivateChatRepository } from './repository';

export class PrivateChatApiService {
  constructor(
    private privateChatRepo: PrivateChatRepository,
    private privateChatMessageRepo: PrivateChatMessageRepository,
  ) {}

  async getMessages(clientId: string, input: GetChatMessagesDto) {
    // check user has joined to the chat
    const hasJoined = await this.privateChatRepo.existsInMembers({
      userId: clientId,
      chatId: input.chatId,
    });

    if (!hasJoined) {
      throw new HttpException(404, 'chat didn\t find');
    }

    // return messages
    return await this.privateChatMessageRepo.getAll(input);
  }
}

// --- injecting repositories to the service
import { PrivateChatMessageModel, PrivateChatModel } from '../db/models';

// --- repositories
const privateChatRepo = new PrivateChatRepository(PrivateChatModel);
const privateChatMessageRepo = new PrivateChatMessageRepository(
  PrivateChatMessageModel,
);

// --- service
export const privateChatApiService = new PrivateChatApiService(
  privateChatRepo,
  privateChatMessageRepo,
);
