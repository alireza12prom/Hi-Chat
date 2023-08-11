import { toObjectId } from '../../common/utils';
import { SessionModel } from '../../db/models';

interface Create {
  userId: string;
  ipAdd: string;
}

interface Exists {
  userId: string;
  ipAdd: string;
}

export class SessionRepository {
  constructor(private sessionModel: typeof SessionModel) {}

  async create(input: Create) {
    return await this.sessionModel.create(input);
  }

  async exists(inupt: Exists) {
    return await this.sessionModel.exists({
      userId: toObjectId(inupt.userId),
      ipAdd: inupt.ipAdd,
    });
  }

  async countByUserId(userId: string) {
    return await this.sessionModel.count({ userId: toObjectId(userId) });
  }
}
