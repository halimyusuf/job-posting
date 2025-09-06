import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import moment from 'moment';
import { jobsApi } from '../api/jobs';
import { applicationsApi } from '../api/applications';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  pending: 'default',
  reviewed: 'primary',
  accepted: 'success',
  rejected: 'error',
};

export const JobApplicationsPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    status: StringParam,
  });

  const { data: job } = useQuery(['job', jobId], () => jobsApi.getJob(jobId!), {
    enabled: !!jobId,
  });

  const { data, isLoading } = useQuery(
    ['job-applications', jobId, query],
    () =>
      applicationsApi.getJobApplications(jobId!, {
        page: query.page || 1,
        status: query.status as any,
      }),
    {
      enabled: !!jobId,
      keepPreviousData: true,
    }
  );

  const { mutate: updateStatus } = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      applicationsApi.updateStatus(id, status as any),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['job-applications', jobId]);
      },
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

  if (!data || !job) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load applications</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Applications for {job.data.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {job.data.company} • {job.data.location}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={query.status || ''}
            label="Filter by Status"
            onChange={(e) => setQuery({ status: e.target.value || undefined })}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {data.data.applications.length === 0 ? (
        <Alert severity="info">No applications found</Alert>
      ) : (
        <>
          {data.data.applications.map((application) => (
            <Paper key={application._id} sx={{ p: 3, mb: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {application.applicant.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {application.applicant.email}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={application.status.toUpperCase()}
                      color={statusColors[application.status]}
                    />
                    <Chip
                      label={`Applied ${moment(application.createdAt).fromNow()}`}
                      variant="outlined"
                    />
                  </Stack>

                  <Link
                    href={application.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'block', mb: 2 }}
                  >
                    View Resume
                  </Link>

                  {application.coverLetter && (
                    <Typography variant="body2" color="text.secondary">
                      {application.coverLetter}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={application.status}
                      size="small"
                      onChange={(e) =>
                        updateStatus({
                          id: application._id,
                          status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="reviewed">Reviewed</MenuItem>
                      <MenuItem value="accepted">Accepted</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={data.data.totalPages}
              page={query.page || 1}
              onChange={(_, page) => setQuery({ page })}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};
