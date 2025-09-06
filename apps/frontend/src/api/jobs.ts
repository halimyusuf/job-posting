import { apiClient } from './client';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  location?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobsApi = {
  getJobs: (filters: JobFilters) => apiClient.get<JobsResponse>('/jobs', { params: filters }),

  getJob: (id: string) => apiClient.get<Job>(`/jobs/${id}`),

  createJob: (data: Omit<Job, '_id' | 'employer' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Job>('/jobs', data),

  updateJob: (id: string, data: Partial<Job>) => apiClient.patch<Job>(`/jobs/${id}`, data),

  deleteJob: (id: string) => apiClient.delete(`/jobs/${id}`),
};
