import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { IUser } from '../models/User';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  applicationQuerySchema,
} from '../validation/application';

interface AuthRequest extends Request {
  user?: IUser;
}

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createApplicationSchema.parse(req.body);
    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user hasn't already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user!._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      ...validatedData,
      job: jobId,
      applicant: req.user!._id,
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, status } = applicationQuerySchema.parse(req.query);
    const query: any = { applicant: req.user!._id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(query).populate('job').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(query),
    ]);

    res.json({
      applications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.jobId;
    const { page, limit, status } = applicationQuerySchema.parse(req.query);

    // Check if job exists and user is the employer
    const job = await Job.findOne({
      _id: jobId,
      employer: req.user!._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const query: any = { job: jobId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('applicant', 'name email resumeLink')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    res.json({
      applications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const getMyApplicationForJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.jobId;

    const application = await Application.findOne({ job: jobId, applicant: req.user!._id }).populate(
      'job'
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = updateApplicationStatusSchema.parse(req.body);
    const applicationId = req.params.id;

    // Find application and check if user is the employer of the associated job
    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Type assertion to access the populated job field
    const job = application.job as any;

    if (job.employer.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};
