import { z } from 'zod';
import { USER_ROLES } from '../utils/constant';

export const createUserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES.map((role) => role.value)),
});

export const updateUserSchema = createUserSchema
  .omit({
    password: true,
  })
  .extend({
    password: z.union([
      z.string().min(6),
      z.literal(''),
      z.undefined(),
      z.null(),
    ]),
  });
