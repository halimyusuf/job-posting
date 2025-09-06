import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/jobs';
import { applicationsApi } from '../api/applications';

interface ApplicationForm {
  resumeLink: string;
  coverLetter?: string;
}

export const JobApplicationPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationForm>();

  const { data: job, isLoading: jobLoading } = useQuery(
    ['job', jobId],
    () => jobsApi.getJob(jobId!),
    {
      enabled: !!jobId,
    }
  );

  const { mutate: apply, isLoading: isApplying } = useMutation(
    (data: ApplicationForm) => applicationsApi.apply(jobId!, data),
    {
      onSuccess: () => {
        navigate('/my-applications');
      },
    }
  );

  if (jobLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apply for {job.data.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          at {job.data.company}
        </Typography>

        <form onSubmit={handleSubmit((data) => apply(data))}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Resume Link"
            {...register('resumeLink', {
              required: 'Resume link is required',
              pattern: {
                value: /^https?:\/\/.+/i,
                message: 'Please enter a valid URL',
              },
            })}
            error={!!errors.resumeLink}
            helperText={errors.resumeLink?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Cover Letter (Optional)"
            multiline
            rows={6}
            {...register('coverLetter')}
            error={!!errors.coverLetter}
            helperText={errors.coverLetter?.message}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isApplying}
              sx={{ mr: 2 }}
            >
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate(`/jobs/${jobId}`)}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
