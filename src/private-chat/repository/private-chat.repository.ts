import { PrivateChatModel } from '../../db/models';
import { Models } from '../../common/constant';
import { toObjectId } from '../../common/utils';

interface CreateOne {
  members: string[];
}

interface Exists extends CreateOne {}

export class PrivateChatRepository {
  constructor(protected chatModel: typeof PrivateChatModel) {}

  async existsByMembers(input: Exists) {
    return await this.chatModel.exists({ members: { $all: input.members } });
  }

  async create(input: CreateOne) {
    return (await this.chatModel.create(input)).populate({
      path: 'members',
      select: 'fname lname',
    });
  }

  async getAll(userId: string) {
    return await this.chatModel
      .aggregate([
        { $match: { members: toObjectId(userId) } },
        {
          $set: {
            members: {
              $filter: {
                input: '$members',
                as: 'member',
                cond: { $ne: ['$$member', toObjectId(userId)] },
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
      ])
      .exec();
  }

  async existsByChatId(chatId: string) {
    return this.chatModel.exists({ _id: chatId });
  }
}
