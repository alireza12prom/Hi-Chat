import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../error';

export function wrapper(cb: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        res.status(error.code).json({ status: 'faild', value: error.message });
      } else {
        res.status(500).json({ status: 'faild', value: 'somethign went wrong!' });
      }
    }
  };
}
