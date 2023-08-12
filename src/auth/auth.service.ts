import { RequestDto, VerifyDto } from './dto';
import jsonwebtoken from 'jsonwebtoken';
import { randomNumber } from '../common/utils';
import { HttpException } from '../common/error';

import {
  SessionRepository,
  UserRepository,
  VerifyMessageRepository,
} from './repository';

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
    private verifyMessageRepo: VerifyMessageRepository,
  ) {}

  async requestToRegister(ipAdd: string, input: RequestDto) {
    let name: string = 'Unknown';
    let userId: string;
    let sessionId: string;

    const account = await this.userRepo.findByEmail(input.email);
    if (account) {
      userId = account.id;
      name = account.fname || name;

      const hasOpenedSession = await this.sessionRepo.exists({ userId, ipAdd });
      if (!hasOpenedSession) {
        // number of session
        const limit = parseInt(process.env.MAX_ACTIVE_SESSION);
        const opendSessions = await this.sessionRepo.countByUserId(userId);

        if (opendSessions >= limit) {
          throw new HttpException(
            400,
            `You have ${limit} active sessions. Close one of them and try again.`,
          );
        }

        // open a new session
        sessionId = (await this.sessionRepo.create({ userId, ipAdd })).id;
      } else {
        sessionId = hasOpenedSession._id.toString();
      }
    } else {
      userId = (await this.userRepo.create(input)).id;
      sessionId = (await this.sessionRepo.create({ userId, ipAdd })).id;
    }

    // create message
    const code = randomNumber(5);
    const message = await this.verifyMessageRepo.create({ userId, code });

    // generaet token
    const secret = process.env.JWT_SECRET;
    const expiresIn = parseInt(process.env.VERIFY_MESSAGE_EXPIRE_SEC);

    const payload = {
      messageId: message.id,
      sessionId: sessionId,
      type: TokenTypes.VERIFY_SMS_TOKEN,
    };

    const token = jsonwebtoken.sign(payload, secret, { expiresIn });

    return { code, token, name, email: input.email };
  }

  async verifyRequest(messageId: string, sessionId: string, input: VerifyDto) {
    const message = await this.verifyMessageRepo.findById(messageId);

    if (!message) {
      throw new HttpException(400, 'please request again');
    }

    if (message.code != input.code) {
      throw new HttpException(400, 'code is not correct');
    }

    // delete message
    await this.verifyMessageRepo.deleteById(messageId);

    // geneate token
    const secert = process.env.JWT_SECRET;
    const expiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRE_DAY);
    const payload = { sessionId: sessionId, type: TokenTypes.ACCESS_TOKEN };

    return jsonwebtoken.sign(payload, secert, { expiresIn: `${expiresIn} days` });
  }
}

// --- injecting repositories to the service
import { UserModel, VerifyMessageModel, SessionModel } from '../db/models';
import { TokenTypes } from '../common/constant';

// --- repositories
const userRepo = new UserRepository(UserModel);
const sessionRepo = new SessionRepository(SessionModel);
const verifyMessageRepo = new VerifyMessageRepository(VerifyMessageModel);

// --- service
export const authService = new AuthService(userRepo, sessionRepo, verifyMessageRepo);
