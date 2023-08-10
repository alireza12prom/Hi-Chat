import Joi from 'joi';

export const CreateChatSchema = Joi.object<CreateChatDto>({
  userId: Joi.string().required(),
});

export interface CreateChatDto {
  userId: string;
}
