import React from 'react';
import {
  Container,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { applicationsApi } from '../api/applications';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';
import { useAuthStore } from '../store/auth';

export const JobsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    search: StringParam,
    type: StringParam,
    location: StringParam,
    minSalary: NumberParam,
    maxSalary: NumberParam,
  });

  const { data, isLoading, error } = useQuery(
    [
      'jobs',
      query.search || '',
      query.type || '',
      query.location || '',
      query.minSalary || '',
      query.maxSalary || '',
      query.page || 1,
    ],
    () =>
      jobsApi.getJobs({
        page: query.page || 1,
        limit: 10,
        search: query.search || undefined,
        type: query.type as any,
        location: query.location || undefined,
        minSalary: query.minSalary as any,
        maxSalary: query.maxSalary as any,
      }),
    {
      keepPreviousData: true,
    }
  );

  // fetch current user's applications so we can mark jobs as applied
  const { data: myApps } = useQuery(
    ['my-applications'],
    () => applicationsApi.getMyApplications({ page: 1, limit: 100 }),
    {
      enabled: !!user,
      retry: false,
    }
  );

  const appliedJobIds = React.useMemo(() => {
    const set = new Set<string>();
    myApps?.data.applications.forEach((a) => set.add(a.job._id));
    return set;
  }, [myApps]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load jobs. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 6,
          mt: 4,
          textAlign: 'center',
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Find Your Dream Job
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Browse through thousands of job opportunities and find the perfect match for your career
        </Typography>

        {user?.role === 'employer' && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/jobs/post')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Post a Job
          </Button>
        )}
      </Box>

      <JobFilters />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data?.data.jobs.length === 0 ? (
        <Alert severity="info">No jobs found matching your criteria.</Alert>
      ) : (
        <>
          {data?.data.jobs.map((job) => (
            <JobCard key={job._id} job={job} applied={appliedJobIds.has(job._id)} />
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={data?.data.totalPages || 1}
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
