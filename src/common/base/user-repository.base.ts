import { UserModel } from '../../db/models';

export abstract class BaseUserRepository {
  constructor(protected userModel: typeof UserModel) {}

  async existsById(userId: string) {
    return await this.userModel.exists({ _id: userId });
  }
}
