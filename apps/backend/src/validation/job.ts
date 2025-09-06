import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  salary: z
    .object({
      min: z.number().positive('Minimum salary must be positive'),
      max: z.number().positive('Maximum salary must be positive'),
      currency: z.string().default('USD'),
    })
    .refine((data) => data.max >= data.min, {
      message: 'Maximum salary must be greater than or equal to minimum salary',
    }),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  location: z.string().optional(),
  minSalary: z.string().transform(Number).optional(),
  maxSalary: z.string().transform(Number).optional(),
});
