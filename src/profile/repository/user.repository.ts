import { BaseUserRepository } from '../../common/base';
import { toObjectId } from '../../common/utils';

interface UpdateOne {
  userId: string;
  fname: string;
  lname: string;
  bio: string;
}

export class UserRepository extends BaseUserRepository {
  async updateOne(input: UpdateOne) {
    return await this.userModel.findOneAndUpdate(
      { _id: toObjectId(input.userId) },
      {
        $set: {
          fname: input.fname || undefined,
          lname: input.lname || undefined,
          bio: input.bio || undefined,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async findById(userId: string) {
    return await this.userModel.findOne({ _id: toObjectId(userId) });
  }
}
