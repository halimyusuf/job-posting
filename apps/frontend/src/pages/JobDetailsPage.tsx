import React from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { jobsApi } from '../api/jobs';
import { applicationsApi } from '../api/applications';
import { useAuthStore } from '../store/auth';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery(['job', id], () => jobsApi.getJob(id!), {
    enabled: !!id,
  });

  // fetch current user's application for this job (if any)
  const { data: myApplication } = useQuery(
    ['my-application', id],
    () => applicationsApi.getMyApplication(id!),
    {
      enabled: !!id && !!user,
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load job details. Please try again later.</Alert>
      </Container>
    );
  }

  const isEmployer = user?.role === 'employer';
  const isJobOwner = user?._id === job.data.employer._id;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {job.data.title}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {job.data.company} • {job.data.location}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={job.data.type} color="primary" />
            {job.data.salary && (
              <Chip
                label={`${job.data.salary.currency} ${job.data.salary.min.toLocaleString()} - ${job.data.salary.max.toLocaleString()}`}
                color="success"
              />
            )}
            <Chip label={`Posted ${moment(job.data.createdAt).fromNow()}`} variant="outlined" />
          </Stack>

          {!isEmployer && !myApplication?.data && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(`/jobs/${id}/apply`)}
              sx={{ mt: 2 }}
            >
              Apply Now
            </Button>
          )}

          {/* Show user's application status if exists */}
          {myApplication?.data && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1">Your Application</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Chip label={(myApplication.data as any).status?.toUpperCase()} color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Applied {moment((myApplication.data as any).createdAt).fromNow()}
                </Typography>
              </Stack>
              {(myApplication.data as any).coverLetter && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {(myApplication.data as any).coverLetter}
                </Typography>
              )}
            </Paper>
          )}

          {isJobOwner && (
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate(`/jobs/${id}/edit`)}>
                Edit Job
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate(`/jobs/${id}/applications`)}
              >
                View Applications
              </Button>
            </Stack>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {job.data.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Requirements
          </Typography>
          <ul>
            {job.data.requirements.map((req, index) => (
              <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                {req}
              </Typography>
            ))}
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};
