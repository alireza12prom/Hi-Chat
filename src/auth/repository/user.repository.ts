import { BaseUserRepository } from '../../common/base';
import { UserModel } from '../../db/models';

interface Create {
  email: string;
}

export class UserRepository extends BaseUserRepository {
  async create(input: Create) {
    return await this.userModel.create({ email: input.email });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
