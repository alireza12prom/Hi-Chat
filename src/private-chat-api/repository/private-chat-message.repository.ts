import { PrivateChatMessageModel } from '../../db/models';
import { toObjectId } from '../../common/utils';
import { Models } from '../../common/constant';

interface getAll {
  chatId: string;
  limit: number;
  page: number;
}

export class PrivateChatMessageRepository {
  constructor(private privateChatMessageModel: typeof PrivateChatMessageModel) {}

  async getAll(input: getAll) {
    return await this.privateChatMessageModel
      .aggregate([
        { $match: { chatId: toObjectId(input.chatId) } },
        { $sort: { createdAt: -1 } },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
        {
          $lookup: {
            from: Models.USER,
            as: 'user',
            foreignField: '_id',
            localField: 'userId',
            pipeline: [{ $project: { fname: 1, lname: 1 } }],
          },
        },
      ])
      .exec();
  }
}
