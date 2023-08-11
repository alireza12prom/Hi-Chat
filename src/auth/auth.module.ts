import express from 'express';
import { AuthService } from './auth.service';
import { BaseHttpGateway } from '../common/base';
import { ReqeustSchema, VerifySchema } from './dto';
import { VerifyEmailService } from './verify-email.service';
import requestIp from 'request-ip';
import { ipv6ToIpv4 } from '../common/utils';

import {
  authorizationMiddleware,
  validateHttpInput,
  wrapper,
} from '../common/middleware';

export class AuthModule extends BaseHttpGateway {
  constructor(
    protected app: express.Application,
    private service: AuthService,
    private verifyEmailService: VerifyEmailService,
  ) {
    super(app, '/api/v1/auth');
  }

  init() {
    // --- middlewares
    this.app.use(requestIp.mw());

    // --- handlers
    this.app.post(
      this.baseUrl + '/reqeust',
      wrapper(this.requestHandler.bind(this)),
    );

    this.app.post(
      this.baseUrl + '/verify',
      authorizationMiddleware,
      wrapper(this.verifyHandler.bind(this)),
    );
  }

  private async requestHandler(req: express.Request, res: express.Response) {
    // validate inputs
    const input = validateHttpInput(req.body, ReqeustSchema);

    // create account
    const clientIp = ipv6ToIpv4(req.clientIp || '');
    const result = await this.service.requestToRegister(clientIp, input);

    // send email
    await this.verifyEmailService.send(
      { name: result.name, email: result.email },
      result.code,
    );

    res.status(201).json({ status: 'success', value: result.token });
  }

  private async verifyHandler(req: express.Request, res: express.Response) {
    // validate inputs
    const input = validateHttpInput(req.body, VerifySchema);

    const { messageId, sessionId } = req.payload;
    const token = await this.service.verifyRequest(messageId, sessionId, input);

    res.status(201).json({ status: 'success', value: token });
  }
}
