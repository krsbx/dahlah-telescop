import dayjs from 'dayjs';
import { z } from 'zod';
import {
  BORROWING_STATUSES,
  OBSERVATION_OBJECT,
  OCCUPATION,
  TELESCOPE_TYPE,
} from '../utils/constant';
import { fileSchema } from './shared';

const baseBorrowTelescopeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  occupation: z.enum(OCCUPATION.map((oc) => oc.value)),
  nimNip: z.string().min(6),
  rightAscescion: z.coerce.number(),
  declination: z.coerce.number(),
  magnitude: z.coerce.number(),
  observationObject: z.enum(OBSERVATION_OBJECT.map((ob) => ob.value)),
  objectType: z.string(),
  telescopeType: z.enum(TELESCOPE_TYPE.map((te) => te.value)),
  proposal: fileSchema,
  introductory: fileSchema,
  borrowingTime: z.coerce.date(),
  borrowingTimeUntil: z.coerce.date(),
});

/**
 * @param {z.infer<typeof baseBorrowTelescopeSchema>} data
 * @param {z.RefinementCtx} ctx
 * @returns
 */
export function borrowTelescopeRefiner(data, ctx) {
  if (dayjs().isAfter(data.borrowingTimeUntil)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'borrowingTimeUntil must be greater than current date',
    });
  }

  if (dayjs(data.borrowingTimeUntil).isBefore(data.borrowingTime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'borrowingTimeUntil must be greater than borrowingTime',
    });
  }

  return data;
}

export const borrowTelescopeSchema = baseBorrowTelescopeSchema.superRefine(
  borrowTelescopeRefiner
);

export const createBorrowTelescopeSchema = baseBorrowTelescopeSchema
  .extend({
    user: z.object({
      label: z.string(),
      value: z.coerce.number(),
    }),
    status: z.enum(BORROWING_STATUSES.map((status) => status.value)),
  })
  .superRefine(borrowTelescopeRefiner);
