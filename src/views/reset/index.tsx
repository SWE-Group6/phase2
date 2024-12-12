import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const ResetButtonPage: React.FC = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const token = await getToken({ template: "convex" });
      const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/reset`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the data");
      }

      // Show success notification
      setNotification({
        open: true,
        message: 'Registry has been reset successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({
        open: true,
        message: 'Failed to reset the registry. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClick}
        disabled={isLoading} // Disable button while loading
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Resetting...' : 'Reset'}
      </Button>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetButtonPage;