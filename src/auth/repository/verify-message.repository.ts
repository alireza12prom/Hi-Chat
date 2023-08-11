import { toObjectId } from '../../common/utils';
import { VerifyMessageModel } from '../../db/models';

interface Create {
  userId: string;
  code: number;
}

export class VerifyMessageRepository {
  constructor(private verifyMessageRepo: typeof VerifyMessageModel) {}

  async create(input: Create) {
    return await this.verifyMessageRepo.create(input);
  }

  async findById(messageId: string) {
    return await this.verifyMessageRepo.findById(messageId);
  }

  async deleteById(messageId: string) {
    return await this.verifyMessageRepo.deleteOne({ _id: toObjectId(messageId) });
  }
}
