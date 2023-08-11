import Joi from 'joi';

export const ReqeustSchema = Joi.object<RequestDto>({
  email: Joi.string().email().required(),
});

export interface RequestDto {
  email: string;
}
