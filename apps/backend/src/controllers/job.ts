import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { createJobSchema, updateJobSchema, jobQuerySchema } from '../validation/job';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createJobSchema.parse(req.body);

    const job = new Job({
      ...validatedData,
      employer: req.user!._id,
    });

    await job.save();

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, type, location, minSalary, maxSalary } = jobQuerySchema.parse(
      req.query
    );

    const query: Record<string, any> = {};
    const sortOptions: Record<string, any> = { createdAt: -1 };

    if (search) {
      const trimmed = search.trim();
      // If the search term is very short (1-2 chars) or looks partial, use regex to match substrings.
      // $text requires tokenization and often ignores short fragments.
      if (trimmed.length <= 6) {
        const re = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
          { title: re },
          { company: re },
          { location: re },
          { description: re },
        ];
      } else {
        // Use text search with score for longer queries
        query.$text = { $search: search };
        // When searching, sort by text score first, then date
        sortOptions.score = { $meta: 'textScore' };
      }
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Handle salary range query
    if (minSalary || maxSalary) {
      if (minSalary) {
        query['salary.min'] = { $gte: Number(minSalary) };
      }
      if (maxSalary) {
        query['salary.max'] = { $lte: Number(maxSalary) };
      }
    }

    const skip = (page - 1) * limit;

    console.log('Query:', JSON.stringify(query));

    const [jobs, total] = await Promise.all([
      Job.find(query, query.$text ? { score: { $meta: "textScore" } } : undefined)
        .populate('employer', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
        Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateJobSchema.parse(req.body);

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user!._id },
      validatedData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employer: req.user!._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};
