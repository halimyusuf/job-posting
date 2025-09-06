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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import moment from 'moment';
import { applicationsApi } from '../api/applications';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  pending: 'default',
  reviewed: 'primary',
  accepted: 'success',
  rejected: 'error',
};

export const MyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    status: StringParam,
  });

  const { data, isLoading } = useQuery(
    ['my-applications', query],
    () =>
      applicationsApi.getMyApplications({
        page: query.page || 1,
        status: query.status as any,
      }),
    {
      keepPreviousData: true,
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

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load applications</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Applications
      </Typography>

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
            <Paper
              key={application._id}
              sx={{
                p: 3,
                mb: 2,
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 },
              }}
              onClick={() => navigate(`/jobs/${application.job._id}`)}
            >
              <Typography variant="h6" gutterBottom>
                {application.job.title}
              </Typography>

              <Typography color="text.secondary" gutterBottom>
                {application.job.company} • {application.job.location}
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

              {application.coverLetter && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {application.coverLetter}
                </Typography>
              )}
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
