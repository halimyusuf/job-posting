import { z } from 'zod';

export const createApplicationSchema = z.object({
  resumeLink: z.string().url('Resume link must be a valid URL'),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'accepted', 'rejected']),
});

export const applicationQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.enum(['pending', 'reviewed', 'accepted', 'rejected']).optional(),
});
