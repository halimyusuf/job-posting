import mongoose from 'mongoose';

export interface IApplication {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resumeLink: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new mongoose.Schema<IApplication>(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeLink: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user can only apply once to a job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
