import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function ComposedTextField() {

  // State for dropdown and form fields
  const [formType, setFormType] = React.useState('URL');
  const [jsProgram, setJsProgram] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [content, setContent] = React.useState('');
  const [debloat_, setDebloat] = React.useState(false);
  const [name, setName] = React.useState('');
  const [zipBase64, setZipBase64] = React.useState('');
  const [secret, setSecret] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [canSetSecret, setCanSetSecret] = React.useState(false);
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const { getToken } = useAuth();
  const { user } = useUser();

  // Check organization membership when component mounts
  React.useEffect(() => {
    const checkOrgMembership = async () => {
      if (user) {
        const orgId = 'org_2plow6YcQeyrrUQEzl72EzJQmDA';
        const membership = user.organizationMemberships.find(
          membership => membership.organization.id === orgId
        );
        
        setCanSetSecret(!!membership);
        // Reset secret to false if user is not in the org
        if (!membership) {
          setSecret(false);
        }
      }
    };

    checkOrgMembership();
  }, [user]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleUpload = async () => {
    // Set loading to true at the start of upload
    setIsLoading(true);

    try {
      const token = await getToken({ template: "convex" });

      if (formType === 'URL') {
        // Validate URL form
        if (url.trim()) {
          const body = {
            URL: url,
            JSProgram: jsProgram,
            Secret: canSetSecret ? secret : false
          };

          const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/package`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("User is not authorized to upload packages.");
            }
            throw new Error("Failed to fetch the data");
          }

          console.log('Uploading Package (URL form)...');
          setJsProgram('');
          setUrl('');

          // Show success notification
          setNotification({
            open: true,
            message: 'Package uploaded successfully!',
            severity: 'success'
          });
        } else {
          console.error('Invalid input. URL is required.');
          // Show error notification
          setNotification({
            open: true,
            message: 'Invalid input. URL is required.',
            severity: 'error'
          });
        }
      } else if (formType === 'Content') {
        // Validate Content form
        if (name.trim() && zipBase64.trim()) {
          const body1 = {
            Content: zipBase64,
            JSProgram: jsProgram,
            debloat: debloat_,
            Name: name,
            Secret: canSetSecret ? secret : false
          };

          const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/package`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body1),
          });

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("User is not authorized to upload packages.");
            }
            throw new Error("Failed to fetch the data");
          }

          console.log('Uploading Package (Content form)...');
          setContent('');
          setJsProgram('');
          setDebloat(false);
          setName('');
          setSecret(false);
          setZipBase64(''); // Clear the zip base64

          // Show success notification
          setNotification({
            open: true,
            message: 'Package uploaded successfully!',
            severity: 'success'
          });
        } else {
          console.error('Invalid input. Content, Name, and Zip file are required.');
          // Show error notification
          setNotification({
            open: true,
            message: 'Invalid input. Content, Name, and Zip file are required.',
            severity: 'error'
          });
        }
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      // Show error notification
      setNotification({
        open: true,
        message: error.message || 'Upload failed. Please try again.',
        severity: 'error'
      });
    } finally {
      // Set loading to false when upload is complete (success or failure)
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/zip') {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get the Base64 result, but strip the prefix if it exists
        let base64 = reader.result as string;
        if (base64.startsWith('data:application/zip;base64,')) {
          base64 = base64.substring('data:application/zip;base64,'.length);
        }
  
        // Now, base64 is clean and you can safely set it
        setZipBase64(base64);
        console.log('Zip file converted to Base64');
      };
      reader.readAsDataURL(file); // Read the file as a data URL (Base64)
    } else {
      console.error('Please upload a valid ZIP file.');
    }
  };
  


  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      noValidate
      autoComplete="off"
    >
      {/* Dropdown Menu for Form Type */}
      <FormControl fullWidth>
        <Select
          labelId="form-type-select-label"
          id="form-type-select"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <MenuItem value="URL">URL</MenuItem>
          <MenuItem value="Content">Content</MenuItem>
        </Select>
      </FormControl>

      {/* URL Form Fields */}
      {formType === 'URL' && (
        <>
          <FormControl variant="standard">
            <InputLabel htmlFor="url-input">URL</InputLabel>
            <Input
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
            />
          </FormControl>

          <FormControl variant="standard">
            <InputLabel htmlFor="js-program-input">JavaScript Program</InputLabel>
            <Input
              id="js-program-input"
              value={jsProgram}
              onChange={(e) => setJsProgram(e.target.value)}
              placeholder="e.g., console.log('Hello, World!')"
            />
          </FormControl>

          {/* Secret Switch (conditionally rendered) */}
          {canSetSecret && (
            <FormControlLabel
              control={
                <Switch
                  checked={secret}
                  onChange={(e) => setSecret(e.target.checked)}
                  color="primary"
                />
              }
              label="Secret"
            />
          )}
        </>
      )}

      {/* Content Form Fields */}
      {formType === 'Content' && (
        <>
          <FormControl variant="standard">
            <InputLabel htmlFor="zip-input"></InputLabel>
            <Input
              id="zip-input"
              type="file"
              onChange={handleFileUpload}
              inputProps={{ accept: '.zip' }}
            />
          </FormControl>

          <FormControl variant="standard">
            <InputLabel htmlFor="js-program-input">JavaScript Program</InputLabel>
            <Input
              id="js-program-input"
              value={jsProgram}
              onChange={(e) => setJsProgram(e.target.value)}
              placeholder="e.g., console.log('Hello, World!')"
            />
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={debloat_}
                onChange={(e) => setDebloat(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Debloat"
          />

          {/* Secret Switch (conditionally rendered) */}
          {canSetSecret && (
            <FormControlLabel
              control={
                <Switch
                  checked={secret}
                  onChange={(e) => setSecret(e.target.checked)}
                  color="primary"
                />
              }
              label="Secret"
            />
          )}

          <FormControl variant="standard">
            <InputLabel htmlFor="name-input">Name</InputLabel>
            <Input
              id="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Package Name"
            />
          </FormControl>
        </>
      )}

      {/* Submit Button with Loading State */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleUpload}
        disabled={isLoading} // Disable button while loading
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Uploading...' : 'Submit'}
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
}