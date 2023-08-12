import { Schema } from 'joi';
import { GatewayException } from '../error';

export function validateSocketBody(input: any, joiSchema: Schema) {
  const { error, value } = joiSchema.validate(input);

  if (error) {
    throw new GatewayException(error.details[0].message);
  }
  return value;
}
