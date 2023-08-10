import Joi from 'joi';

export const SendMessageSchema = Joi.object<SendMessageDto>({
  chatId: Joi.string().required(),
  body: Joi.string().required(),
});

export interface SendMessageDto {
  chatId: string;
  body: string;
}
