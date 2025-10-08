import dayjs from 'dayjs';
import { z } from 'zod';

export const downloadAwsSchema = z.object({
  startDate: z.string().transform((data, ctx) => {
    if (!dayjs(data).isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'startDate must be a valid date',
      })
    }

    return data
  }),
  endDate: z.string().optional().transform((data, ctx) => {
    if (data && !dayjs(data).isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endDate must be a valid date',
      })
    }

    return data
  })
}).transform((data, ctx) => {
  if (data.startDate) {
    data.startDate = dayjs(data.startDate).toISOString();
  }

  if ('endDate' in data) {
    if (data.endDate) {
      data.endDate = dayjs(data.endDate).toISOString();
    } else {
      delete data.endDate
    }
  }

  return data
});
