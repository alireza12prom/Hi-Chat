import { Socket } from 'socket.io';
import jsonwebtoken from 'jsonwebtoken';
import { SessionModel } from '../../db/models';

export async function socketAuthorizationMiddleware(t: string, socket: Socket) {
  const bearerToken = socket.handshake.headers.authorization || '';
  const token = bearerToken.split(' ')[1];

  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as any;

    // check token type
    if (payload.type != t) throw new Error();

    // check session
    const session = await SessionModel.findById(payload.sessionId);
    if (!session) throw new Error();

    socket.data = {
      userId: session.userId.toString(),
    };
  } catch (error) {
    socket.disconnect();
  }
}
