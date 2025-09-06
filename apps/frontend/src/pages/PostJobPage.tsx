import { useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'] as const;

interface JobFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  type: (typeof jobTypes)[number];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  description: '',
  requirements: [''],
  type: 'full-time',
};

export function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof JobFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleRequirementChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRequirements = [...formData.requirements];
      newRequirements[index] = event.target.value;
      setFormData((prev) => ({ ...prev, requirements: newRequirements }));
    };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData((prev) => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSalaryChange =
    (field: 'min' | 'max' | 'currency') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'currency' ? event.target.value : Number(event.target.value);
      setFormData((prev) => ({
        ...prev,
        salary: {
          ...(prev.salary || { min: 0, max: 0, currency: 'USD' }),
          [field]: value,
        },
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await apiClient.post('/jobs', formData);
      navigate('/employer/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job posting');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Post a New Job
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
            {jobTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
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

          {formData.requirements.map((req, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: supperess
            <Stack key={index} direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={`Requirement ${index + 1}`}
                value={req}
                onChange={handleRequirementChange(index)}
                required
              />
              <IconButton
                color="error"
                onClick={() => removeRequirement(index)}
                disabled={formData.requirements.length === 1}
              >
                <RemoveIcon />
              </IconButton>
              {index === formData.requirements.length - 1 && (
                <IconButton color="primary" onClick={addRequirement}>
                  <AddIcon />
                </IconButton>
              )}
            </Stack>
          ))}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Salary Range (Optional)
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Min Salary"
              type="number"
              value={formData.salary?.min || ''}
              onChange={handleSalaryChange('min')}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              label="Max Salary"
              type="number"
              value={formData.salary?.max || ''}
              onChange={handleSalaryChange('max')}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              disabled
              label="Currency"
              value={formData.salary?.currency || 'USD'}
              onChange={handleSalaryChange('currency')}
            />
          </Stack>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Post Job
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
