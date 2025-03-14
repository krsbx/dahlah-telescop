import { z } from 'zod';

export const fileSchema = z.any().refine((files) => {
  
  if (!Array.isArray(files) && !(files instanceof FileList)) return false;
  if (files.length !== 1) return false;
  
  if (!(files[0] instanceof File)) return false;

  return true;
}, 'Files are required');
