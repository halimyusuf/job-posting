import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useAuthStore } from '../store/auth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'employer';
  resumeLink?: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [role, setRole] = useState<'user' | 'employer'>('user');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role, data.resumeLink);
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          label="Full Name"
          autoFocus
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">I want to</FormLabel>
          <RadioGroup
            row
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'employer')}
          >
            <FormControlLabel
              value="user"
              control={<Radio {...register('role', { required: 'Role is required' })} />}
              label="Find a job"
            />
            <FormControlLabel
              value="employer"
              control={<Radio {...register('role', { required: 'Role is required' })} />}
              label="Post jobs"
            />
          </RadioGroup>
          {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
        </FormControl>

        {role === 'user' && (
          <TextField
            margin="normal"
            fullWidth
            label="Resume Link (Optional)"
            {...register('resumeLink', {
              pattern: {
                value: /^https?:\/\/.+/i,
                message: 'Please enter a valid URL',
              },
            })}
            error={!!errors.resumeLink}
            helperText={errors.resumeLink?.message}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Button component={RouterLink} to="/login" fullWidth sx={{ textAlign: 'center' }}>
          Already have an account? Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};
