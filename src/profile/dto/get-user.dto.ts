import Joi from 'joi';

export const GetUserSchema = Joi.object<GetUserDto>({
  userId: Joi.string().required(),
});

export interface GetUserDto {
  userId: string;
}
