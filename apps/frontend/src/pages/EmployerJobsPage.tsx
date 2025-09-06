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
import { useQueryParams, NumberParam } from 'use-query-params';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { JobCard } from '../components/JobCard';
import { useAuthStore } from '../store/auth';

export const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [query, setQuery] = useQueryParams({ page: NumberParam });

  const { data, isLoading, error } = useQuery(
    ['employer-jobs', user?._id, query],
    () =>
      jobsApi.getJobs({
        page: query.page || 1,
        limit: 10,
        // filter by employer id
        ...{ employer: user?._id },
      }),
    {
      enabled: !!user?._id,
      keepPreviousData: true,
    }
  );

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load your job postings. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          My Job Postings
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/jobs/post')}>
          Post a Job
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data?.data.jobs.length === 0 ? (
        <Alert severity="info">You haven't posted any jobs yet.</Alert>
      ) : (
        <>
          {data?.data.jobs.map((job) => (
            <JobCard key={job._id} job={job} />
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
