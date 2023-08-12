import { GetUserDto, UpdateProfileDto } from './dto';
import { UserRepository } from './repository';

export class ProfileService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(clientId: string) {
    return this.userRepo.findById(clientId);
  }

  async updateProfile(clientId: string, input: UpdateProfileDto) {
    return await this.userRepo.updateOne({ userId: clientId, ...input });
  }

  async getUser(input: GetUserDto) {
    const profile = await this.userRepo.findById(input.userId);
    if (!profile) {
      throw new HttpException(404, "user didn't find");
    }

    return {
      _id: profile._id,
      fname: profile.fname,
      lname: profile.lname,
      bio: profile.bio,
      createdAt: profile.createdAt,
      updateAt: profile.updatedAt,
    };
  }
}

// --- injecting repositories to the service
import { UserModel } from '../db/models';
import { HttpException } from '../common/error';

// --- repositories
const userRepo = new UserRepository(UserModel);

// --- service
export const profileService = new ProfileService(userRepo);
