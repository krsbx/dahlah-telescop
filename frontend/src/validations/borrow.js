import { z } from 'zod';
import { fileSchema } from './shared';
import {
  OBSERVATION_OBJECT,
  OCCUPATION,
  TELESCOPE_TYPE,
} from '../utils/constant';

export const borrowTelescopeSchema = z.object({
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
