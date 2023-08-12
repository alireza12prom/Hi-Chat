import Joi from 'joi';

export const DeleteChatSchema = Joi.object<DeleteChatDto>({
  chatId: Joi.string().required(),
});

export interface DeleteChatDto {
  chatId: string;
}
