import Joi from 'joi';
import { HttpException } from '../error';

export function validateHttpInput(object: any, joiSchema: Joi.Schema) {
  const { value, error } = joiSchema.validate(object);

  if (error) {
    throw new HttpException(400, error.details[0].message);
  }
  return value;
}
