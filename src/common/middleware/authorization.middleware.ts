import jsonwebtoken from 'jsonwebtoken';
import { HttpException } from '../error';
import { NextFunction, Request, Response } from 'express';

export function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const bearerToken = req.headers.authorization || '';
  const token = bearerToken.split(' ')[1];

  try {
    req.payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: 'unauthorized', value: 'token is not valid or expired' });
  }
}
