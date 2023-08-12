import Joi from 'joi';

export const GetChatSchema = Joi.object<GetChatsDto>({
  limit: Joi.number().min(5).optional().default(5),
  page: Joi.number().min(1).optional().default(1),
});

export interface GetChatsDto {
  limit: number;
  page: number;
}
