import { apiClient } from './client';
import { Job } from './jobs';

export interface Application {
  _id: string;
  job: Job;
  applicant: {
    _id: string;
    name: string;
    email: string;
    resumeLink?: string;
  };
  resumeLink: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const applicationsApi = {
  apply: (jobId: string, data: { resumeLink: string; coverLetter?: string }) =>
    apiClient.post<Application>(`/jobs/${jobId}/apply`, data),

  getMyApplications: (filters: ApplicationFilters = {}) =>
    apiClient.get<ApplicationsResponse>('/my-applications', { params: filters }),

  getJobApplications: (jobId: string, filters: ApplicationFilters = {}) =>
    apiClient.get<ApplicationsResponse>(`/jobs/${jobId}/applications`, { params: filters }),

  getMyApplication: (jobId: string) => apiClient.get<Application>(`/jobs/${jobId}/my-application`),

  updateStatus: (applicationId: string, status: Application['status']) =>
    apiClient.patch<Application>(`/applications/${applicationId}/status`, { status }),
};
