import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobsApi } from '../api/jobs';

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'] as const;

export const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: jobData, isLoading } = useQuery(['job', id], () => jobsApi.getJob(id!), {
    enabled: !!id,
  });

  useEffect(() => {
    if (jobData) {
      const payload = {
        title: jobData.data.title,
        company: jobData.data.company,
        location: jobData.data.location,
        description: jobData.data.description,
        requirements: jobData.data.requirements || [''],
        type: jobData.data.type,
        salary: jobData.data.salary || undefined,
      };
      setFormData(payload);
    }
  }, [jobData]);

  const { mutateAsync: updateJob } = useMutation((data: any) => jobsApi.updateJob(id!, data));

  const handleInputChange = (field: string) => (e: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRequirementChange = (index: number) => (e: any) => {
    const newReq = [...formData.requirements];
    newReq[index] = e.target.value;
    setFormData((prev: any) => ({ ...prev, requirements: newReq }));
  };

  const addRequirement = () =>
    setFormData((prev: any) => ({ ...prev, requirements: [...prev.requirements, ''] }));
  const removeRequirement = (index: number) =>
    setFormData((prev: any) => ({
      ...prev,
      requirements: prev.requirements.filter((_: any, i: number) => i !== index),
    }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    try {
      await updateJob(formData);
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    }
  };

  if (isLoading || !formData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Job
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Job Title"
            value={formData.title}
            onChange={handleInputChange('title')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Company"
            value={formData.company}
            onChange={handleInputChange('company')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={handleInputChange('location')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Job Type"
            value={formData.type}
            onChange={handleInputChange('type')}
            margin="normal"
            required
          >
            {jobTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Job Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Requirements
          </Typography>
          {formData.requirements.map((r: string, idx: number) => (
            <Stack key={idx} direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField fullWidth value={r} onChange={handleRequirementChange(idx)} />
              <IconButton
                color="error"
                onClick={() => removeRequirement(idx)}
                disabled={formData.requirements.length === 1}
              >
                <RemoveIcon />
              </IconButton>
              {idx === formData.requirements.length - 1 && (
                <IconButton color="primary" onClick={addRequirement}>
                  <AddIcon />
                </IconButton>
              )}
            </Stack>
          ))}

          <Box sx={{ mt: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
