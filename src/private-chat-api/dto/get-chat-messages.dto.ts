import Joi from 'joi';

export const GetChatMessagesSchema = Joi.object<GetChatMessagesDto>({
  chatId: Joi.string().required(),
  limit: Joi.number().greater(4).optional().default(5),
  page: Joi.number().greater(0).optional().default(1),
});

export interface GetChatMessagesDto {
  chatId: string;
  limit: number;
  page: number;
}
