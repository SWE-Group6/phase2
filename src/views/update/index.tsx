import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '@clerk/clerk-react';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ComposedTextField() {
  const updateAction = useAction(api.actions.updatePackage.updatePackage);

  // State for dropdown and form fields
  const [formType, setFormType] = React.useState('URL');
  const [jsProgram, setJsProgram] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [debloat_, setDebloat] = React.useState(false);
  const [name, setName] = React.useState('');
  const [zipBase64, setZipBase64] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [id, setId] = React.useState('');
  const { getToken } = useAuth();

  // New state for loading and notifications
  const [isLoading, setIsLoading] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const token = await getToken({template: "convex"});

      if (formType === 'Content') {
        // Validate Content form
        if (zipBase64 && version.trim() && name.trim() && id.trim()) {
          const body = {
            metadata: {
              Name: name,
              Version: version,
              ID: id,
              Secret: false
            },
            data: {
              Name: name,
              URL: '',
              Content: zipBase64,
              JSProgram: jsProgram,
              debloat: debloat_
            }
          };

          const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/package/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error("Failed to update package");
          }

          // Success notification
          setNotification({
            open: true,
            message: 'Package updated successfully!',
            severity: 'success'
          });

          // Reset form
          setZipBase64('');
          setJsProgram('');
          setVersion('');
          setDebloat(false);
          setName('');
          setId('');
        } else {
          throw new Error('Invalid input. All fields are required.');
        }
      } else if (formType === 'URL') {
        // Validate URL form
        if (url.trim() && version.trim()) {
          const body = {
            metadata: {
              Name: name,
              Version: version,
              ID: id
            },
            data: {
              Name: name,
              Content: "kg2f57mc797wpc0ew5smgj5mzn76b5gg",
              URL: url,
              JSProgram: jsProgram
            }
          };

          const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/package/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error("Failed to upload package");
          }

          // Success notification
          setNotification({
            open: true,
            message: 'Package updated successfully!',
            severity: 'success'
          });

          // Reset form
          setUrl('');
          setJsProgram('');
          setVersion('');
          setName('');
          setId('');
        } else {
          throw new Error('Invalid input. URL and Version are required.');
        }
      }
    } catch (error) {
      // Error notification
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/zip') {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64 = reader.result as string;
        if (base64.startsWith('data:application/zip;base64,')) {
          base64 = base64.substring('data:application/zip;base64,'.length);
        }
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
      sx={{ '& > :not(style)': { m: 1, width: '100%' } }} // Full-width form fields
      noValidate
      autoComplete="off"
    >
      {/* Dropdown Menu for Form Type */}
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
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
          {/* URL Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="url-input">URL</InputLabel>
            <Input
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
            />
          </FormControl>

          {/* JavaScript Program Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="js-program-input">JavaScript Program</InputLabel>
            <Input
              id="js-program-input"
              value={jsProgram}
              onChange={(e) => setJsProgram(e.target.value)}
              placeholder="e.g., console.log('Hello, World!')"
            />
          </FormControl>

          {/* Name Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="name-input">Name</InputLabel>
            <Input
              id="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Package Name"
            />
          </FormControl>

          {/* ID Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="id-input">ID</InputLabel>
            <Input
              id="id-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g., Package ID"
            />
          </FormControl>

          {/* Version Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="version-input">Version</InputLabel>
            <Input
              id="version-input"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
            />
          </FormControl>
        </>
      )}

      {/* Content Form Fields */}
      {formType === 'Content' && (
        <>
          {/* File Input for Content (ZIP file) */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="zip-input"></InputLabel>
            <Input
              id="zip-input"
              type="file"
              onChange={handleFileUpload}
              inputProps={{ accept: '.zip' }}
            />
          </FormControl>

          {/* JavaScript Program Input */}
          <FormControl variant="standard" fullWidth>
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

          {/* Version Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="version-input">Version</InputLabel>
            <Input
              id="version-input"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
            />
          </FormControl>

          {/* Name Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="name-input">Name</InputLabel>
            <Input
              id="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Package Name"
            />
          </FormControl>

          {/* ID Input */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="id-input">ID</InputLabel>
            <Input
              id="id-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g., Package ID"
            />
          </FormControl>
        </>
      )}

      {/* Submit Button with Loading State */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={isLoading}
        sx={{ width: '100%', marginTop: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbar-root': {
            width: 'auto',
            maxWidth: '300px',
            right: 16,
            bottom: 16,
          },
          '& .MuiAlert-root': {
            width: 'auto',
          }
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: 'auto', maxWidth: '300px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
