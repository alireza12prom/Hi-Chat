import express from 'express';
import { GetChatMessagesSchema } from './dto';
import { BaseHttpGateway } from '../common/base';
import { validateHttpInput, wrapper } from '../common/middleware';
import { PrivateChatApiService } from './private-chat-api.service';

export class PrivateChatApiModule extends BaseHttpGateway {
  constructor(
    protected app: express.Application,
    private service: PrivateChatApiService,
  ) {
    super(app, '/api/v1/private-chat');
  }

  init() {
    // FIXME: the authorization header shoud be verifyed
    this.app.use((req, res, next) => {
      req.user = { id: req.headers.authorization as string };
      next();
    });

    this.app.get(
      this.baseUrl + '/messages/:chatId',
      wrapper(this.getChatMessages.bind(this)),
    );
  }

  private async getChatMessages(req: express.Request, res: express.Response) {
    // validate inputs
    const { chatId } = req.params;
    const { page, limit } = req.query;
    const input = validateHttpInput({ chatId, limit, page }, GetChatMessagesSchema);

    const result = await this.service.getMessages(req.user.id, input);
    res.status(200).json({ status: 'success', value: result });
  }
}
