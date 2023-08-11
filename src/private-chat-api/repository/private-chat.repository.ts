import { toObjectId } from '../../common/utils';
import { PrivateChatModel } from '../../db/models';

interface ExistsInChat {
  chatId: string;
  userId: string;
}

export class PrivateChatRepository {
  constructor(protected chatModel: typeof PrivateChatModel) {}

  async existsInMembers(input: ExistsInChat) {
    return await this.chatModel.exists({
      _id: toObjectId(input.chatId),
      members: toObjectId(input.userId),
    });
  }
}
