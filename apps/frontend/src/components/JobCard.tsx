import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Job } from '../api/jobs';

interface JobCardProps {
  job: Job;
  applied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, applied = false }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}15`,
        },
      }}
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <CardContent
        sx={{
          '&:last-child': { pb: 3 },
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          {job.title}
        </Typography>

        <Typography color="text.secondary" gutterBottom>
          {job.company} • {job.location}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={job.type} size="small" color="primary" variant="outlined" />
          {job.salary && (
            <Chip
              label={`${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {job.description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box display='flex' alignItems='center' gap={1}>  
          <Typography variant="caption" color="text.secondary">
              Posted {moment(job.createdAt).fromNow()}
            </Typography>

             {applied && <Chip label="Applied" color="primary" size="small" />}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${job._id}`);
              }}
            >
              View Details
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
