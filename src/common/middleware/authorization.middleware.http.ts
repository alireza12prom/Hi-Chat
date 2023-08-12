import jsonwebtoken from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { SessionModel } from '../../db/models';

export function httpAuthorizationMiddleware(t: string, session: boolean = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization || '';
    const token = bearerToken.split(' ')[1];

    try {
      req.payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      // checking token type
      if (req.payload.type != t) throw new Error();

      // retrive user from db
      if (session) {
        const session = await SessionModel.findById(req.payload.sessionId);
        if (!session) throw new Error();

        req.user = {
          id: session.userId.toString(),
        };
      }
      next();
    } catch (error) {
      res
        .status(401)
        .json({ status: 'faild', value: 'token is not valid or expired' });
    }
  };
}
