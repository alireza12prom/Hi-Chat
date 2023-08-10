import Joi from 'joi';

export const DeleteMessageSchema = Joi.object<DeleteMessageDto>({
  chatId: Joi.string().required(),
  messageId: Joi.string().required(),
});

export interface DeleteMessageDto {
  chatId: string;
  messageId: string;
}
