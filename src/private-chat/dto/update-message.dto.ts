import Joi from 'joi';

export const UpdateMessageSchema = Joi.object<UpdateMessageDto>({
  chatId: Joi.string().required(),
  messageId: Joi.string().required(),
  body: Joi.string().required(),
});

export interface UpdateMessageDto {
  chatId: string;
  messageId: string;
  body: string;
}
