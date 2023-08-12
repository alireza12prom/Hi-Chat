import Joi from 'joi';

export const UpdateProfileSchema = Joi.object<UpdateProfileDto>({
  fname: Joi.string().optional().default(null),
  lname: Joi.string().optional().default(null),
  bio: Joi.string().optional().default(null),
});

export interface UpdateProfileDto {
  fname: string;
  lname: string;
  bio: string;
}
