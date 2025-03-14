const dayjs = require('dayjs');
const { z } = require('zod');
const {
  OCCUPATION,
  OBSERVATION_OBJECT,
  TELESCOPE_TYPE,
  BORROWING_STATUS,
} = require('../utils/constant');

const baseBorrowingSchema = z.object({
  userId: z.number(),
  name: z.string(),
  email: z.string().email(),
  occupation: z.enum(Object.values(OCCUPATION)),
  nimNip: z.string(),
  rightAscescion: z.coerce.number(),
  declination: z.coerce.number(),
  magnitude: z.coerce.number(),
  observationObject: z.enum(Object.values(OBSERVATION_OBJECT)),
  objectType: z.string(),
  telescopeType: z.enum(Object.values(TELESCOPE_TYPE)),
  proposalUrl: z.string().url(),
  introductoryUrl: z.string().url(),
  borrowingTime: z.coerce.date(),
  borrowingTimeUntil: z.coerce.date(),
  status: z
    .enum(Object.values(BORROWING_STATUS))
    .default(BORROWING_STATUS.PENDING),
});

exports.createBorrowingSchema = baseBorrowingSchema.superRefine((data, ctx) => {
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
});

exports.updateBorrowingSchema = baseBorrowingSchema.partial();
