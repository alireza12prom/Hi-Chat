import { ProfileService } from './profile.service';
import { TokenTypes } from '../common/constant';
import { BaseHttpGateway } from '../common/base';
import { GetUserSchema, UpdateProfileSchema } from './dto';
import express, { Request, Response, NextFunction } from 'express';

import {
  httpAuthorizationMiddleware,
  validateHttpInput,
  wrapper,
} from '../common/middleware';

export class ProfileModule extends BaseHttpGateway {
  constructor(protected app: express.Application, private service: ProfileService) {
    super(app, '/api/v1/profile');
  }

  init() {
    // --- middleware
    this.app.use(this.baseUrl, httpAuthorizationMiddleware(TokenTypes.ACCESS_TOKEN));

    // --- handlers
    this.app.get(this.baseUrl, wrapper(this.getProfile.bind(this)));
    this.app.patch(this.baseUrl, wrapper(this.updateProfile.bind(this)));
    this.app.get(this.baseUrl + '/:userId', wrapper(this.getUser.bind(this)));
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    const result = await this.service.getProfile(req.user.id);
    res.status(200).json(result);
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const input = validateHttpInput(req.body, UpdateProfileSchema);

    const result = await this.service.updateProfile(req.user.id, input);
    res.status(200).json(result);
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const input = validateHttpInput({ userId }, GetUserSchema);

    const result = await this.service.getUser(input);
    res.status(200).json(result);
  }
}
