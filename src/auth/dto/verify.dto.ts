import Joi from 'joi';

export const VerifySchema = Joi.object<VerifyDto>({
  code: Joi.number().integer().required(),
});

export interface VerifyDto {
  code: number;
}
