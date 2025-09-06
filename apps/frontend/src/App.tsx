import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobsListPage } from './pages/JobsListPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { EditJobPage } from './pages/EditJobPage';
import { JobApplicationPage } from './pages/JobApplicationPage';
import { JobApplicationsPage } from './pages/JobApplicationsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { PostJobPage } from './pages/PostJobPage';
import { EmployerJobsPage } from './pages/EmployerJobsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Navbar } from './components/Navbar';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
              <Navbar />
              <Box sx={{ pt: 2, pb: 4 }}>
                <Routes>
                  <Route path="/" element={<JobsListPage />} />
                  <Route path="/jobs/:id" element={<JobDetailsPage />} />
                  <Route
                    path="/jobs/:id/edit"
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <EditJobPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:id/apply"
                    element={
                      <ProtectedRoute allowedRoles={['user']}>
                        <JobApplicationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:id/applications"
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <JobApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-applications"
                    element={
                      <ProtectedRoute allowedRoles={['user']}>
                        <MyApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/jobs/post"
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <PostJobPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employer/jobs"
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <EmployerJobsPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Box>
            </Box>
          </QueryParamProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
