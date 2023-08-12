import { toObjectId } from '../../common/utils';
import { PrivateChatMessageModel } from '../../db/models';

interface CreateOne {
  body: string;
  userId: string;
  chatId: string;
}

interface DeleteOne {
  chatId: string;
  userId: string;
  messageId: string;
}

interface UpdateOne extends DeleteOne {
  body: string;
}

export class PrivateChatMessageRepository {
  constructor(protected chatMessageModel: typeof PrivateChatMessageModel) {}

  async create(input: CreateOne) {
    return await (
      await this.chatMessageModel.create(input)
    ).populate({
      path: 'user',
      select: 'fname lname',
    });
  }

  async delete(input: DeleteOne) {
    return await this.chatMessageModel.findOneAndDelete(
      {
        _id: input.messageId,
        chatId: input.chatId,
        userId: input.userId,
      },
      { returnDocument: 'after' },
    );
  }

  async updateOne(input: UpdateOne) {
    return await this.chatMessageModel.findOneAndUpdate(
      {
        _id: input.messageId,
        chatId: input.chatId,
        userId: input.userId,
      },
      { $set: { body: input.body } },
      { returnDocument: 'after' },
    );
  }

  async deleteMessages(chatId: string) {
    return await this.chatMessageModel.deleteMany({ chatId: toObjectId(chatId) });
  }
}
