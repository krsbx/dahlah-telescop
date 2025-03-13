import { z } from 'zod';
import { USER_ROLES } from '../utils/constant';

export const signUpSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES.map((role) => role.value)),
});
