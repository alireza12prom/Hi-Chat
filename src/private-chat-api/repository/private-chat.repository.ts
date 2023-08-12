import { Models } from '../../common/constant';
import { toObjectId } from '../../common/utils';
import { PrivateChatModel } from '../../db/models';

interface ExistsInChat {
  chatId: string;
  userId: string;
}

interface GetAll {
  userId: string;
  page: number;
  limit: number;
}

export class PrivateChatRepository {
  constructor(protected chatModel: typeof PrivateChatModel) {}

  async existsInMembers(input: ExistsInChat) {
    return await this.chatModel.exists({
      _id: toObjectId(input.chatId),
      members: toObjectId(input.userId),
    });
  }

  async getAll(input: GetAll) {
    return this.chatModel.aggregate([
      { $match: { members: toObjectId(input.userId) } },
      { $sort: { createdAt: -1 } },
      { $limit: input.limit },
      { $skip: (input.page - 1) * input.limit },
      {
        $set: {
          members: {
            $filter: {
              input: '$members',
              as: 'member',
              cond: { $ne: ['$$member', toObjectId(input.userId)] },
              limit: 1,
            },
          },
        },
      },
      {
        $lookup: {
          from: Models.USER,
          localField: 'members.0',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { email: 0, createdAt: 0, updatedAt: 0 } }],
        },
      },
    ]);
  }
}
