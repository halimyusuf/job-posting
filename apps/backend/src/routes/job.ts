import express from 'express';
import { createJob, getJobs, getJob, updateJob, deleteJob } from '../controllers/job';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes (employers only)
router.post('/', auth, checkRole(['employer']), createJob);
router.patch('/:id', auth, checkRole(['employer']), updateJob);
router.delete('/:id', auth, checkRole(['employer']), deleteJob);

export default router;
