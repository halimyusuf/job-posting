import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  InputBase,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthStore } from '../store/auth';

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {user?.role === 'employer' ? (
        <MenuItem
          onClick={() => {
            navigate('/jobs/post');
            handleClose();
          }}
        >
          Post a Job
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            navigate('/my-applications');
            handleClose();
          }}
        >
          My Applications
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {isAuthenticated ? (
        <>
          <MenuItem
            onClick={() => {
              navigate('/');
              handleClose();
            }}
          >
            Browse Jobs
          </MenuItem>
          {user?.role === 'employer' ? (
            <MenuItem
              onClick={() => {
                navigate('/jobs/new');
                handleClose();
              }}
            >
              Post a Job
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                navigate('/my-applications');
                handleClose();
              }}
            >
              My Applications
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            onClick={() => {
              navigate('/login');
              handleClose();
            }}
          >
            Login
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/register');
              handleClose();
            }}
          >
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ background: 'lightblue' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: 1 }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            {/* <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, color: "#fff" }}>{user?.name?.charAt(0).toUpperCase() || 'JB'}</Avatar> */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 800 }}
            >
              Job Board
            </Typography>
          </Box>

          {/* Search - visible on desktop */}
          {!isMobile && (
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                py: 0.5,
                flex: 1,
                maxWidth: 640,
                mx: 2,
                bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
                borderRadius: 2,
                boxShadow: 'none',
              }}
            >
              <IconButton sx={{ p: '6px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search jobs, company, or location"
                inputProps={{ 'aria-label': 'search jobs' }}
                sx={{ ml: 1, flex: 1 }}
              />
              <Button variant="contained" color="primary" sx={{ ml: 1, borderRadius: 2 }}>
                Search
              </Button>
            </Paper>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                {user?.role === 'user' && (
                  <Button component={RouterLink} to="/" color="primary">
                    Browse Jobs
                  </Button>
                )}
                {user?.role === 'employer' && (
                  <Button component={RouterLink} to="/employer/jobs" color="primary">
                    View Posting
                  </Button>
                )}
              </>
            )}

            {isAuthenticated && user?.role === 'employer' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/jobs/post')}
                sx={{ ml: 1, borderRadius: 2 }}
              >
                Post a Job
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                {userMenu}
              </>
            ) : (
              !isMobile && (
                <>
                  <Button component={RouterLink} to="/login" color="inherit">
                    Login
                  </Button>
                  <Button component={RouterLink} to="/register" variant="contained" color="primary">
                    Register
                  </Button>
                </>
              )
            )}

            {/* Mobile menu trigger */}
            {isMobile && (
              <>
                <IconButton size="large" edge="end" color="inherit" onClick={handleMobileMenu}>
                  <MenuIcon />
                </IconButton>
                {mobileMenu}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
