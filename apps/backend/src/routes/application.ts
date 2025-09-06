import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getMyApplicationForJob,
  getJobApplications,
  updateApplicationStatus,
} from '../controllers/application';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// Job seeker routes
router.post('/jobs/:jobId/apply', auth, checkRole(['user']), applyToJob);
router.get('/my-applications', auth, checkRole(['user']), getMyApplications);
router.get('/jobs/:jobId/my-application', auth, checkRole(['user']), getMyApplicationForJob);

// Employer routes
router.get('/jobs/:jobId/applications', auth, checkRole(['employer']), getJobApplications);
router.patch('/applications/:id/status', auth, checkRole(['employer']), updateApplicationStatus);

export default router;
