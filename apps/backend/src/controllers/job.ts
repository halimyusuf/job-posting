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

    const query: any = {};

    if (search) {
      // use regex for text search
      query.$text = { $search: search };
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      // @ts-ignore
      if (minSalary) query.salary.$gte = parseInt(minSalary);
      // @ts-ignore
      if (maxSalary) query.salary.$lte = parseInt(maxSalary);
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name email')
        .sort({ createdAt: -1 })
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
