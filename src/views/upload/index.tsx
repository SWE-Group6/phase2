import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

export default function ComposedTextField() {
  const uploadAction = useAction(api.actions.qualifyPackage.qualifyPackage);

  // State for dropdown and form fields
  const [formType, setFormType] = React.useState('URL');
  const [jsProgram, setJsProgram] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [content, setContent] = React.useState('');
  const [debloat_, setDebloat] = React.useState(false);
  const [name, setName] = React.useState('');
  const [zipBase64, setZipBase64] = React.useState('');
  const [secret, setSecret] = React.useState(false);
  const [version, setVersion] = React.useState('');

  const handleUpload = async () => {
    if (formType === 'URL') {
      // Validate URL form
      if (url.trim() ) {
        uploadAction({
          Data: {
            URL: url.trim(),
            JSProgram: jsProgram.trim() || '',
            Secret: false,
          },
        });
        console.log('Uploading Package (URL form)...');
        setJsProgram('');
        setUrl('');
      } else {
        console.error('Invalid input. URL is required.');
      }
    } else if (formType === 'Content') {
      // Validate Content form
      if (name.trim() && zipBase64.trim() ) {
        uploadAction({
          Data: {
            Content: zipBase64,
            JSProgram: jsProgram.trim() || '',
            Name: name.trim(),
            debloat: debloat_,
            Secret: false,
            Version: version.trim(),
          },
        });
        console.log('Uploading Package (Content form)...');
        setContent('');
        setJsProgram('');
        setDebloat(false);
        setName('');
        setSecret(false);
        setVersion('');

      } else {
        console.error('Invalid input. Content, Name, and Zip file are required.');
      }
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
      sx={{ '& > :not(style)': { m: 1 } }}
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
          <FormControl
            variant="standard"
            sx={{
              '& .MuiInput-underline:before': { borderColor: 'gray' },
              '& .MuiInput-underline:after': { borderColor: 'blue' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'blue' },
            }}
          >
            <InputLabel htmlFor="url-input">URL</InputLabel>
            <Input
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
            />
          </FormControl>

          {/* JavaScript Program Input */}
          <FormControl
            variant="standard"
            sx={{
              '& .MuiInput-underline:before': { borderColor: 'gray' },
              '& .MuiInput-underline:after': { borderColor: 'blue' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'blue' },
            }}
          >
            <InputLabel htmlFor="js-program-input">JavaScript Program</InputLabel>
            <Input
              id="js-program-input"
              value={jsProgram}
              onChange={(e) => setJsProgram(e.target.value)}
              placeholder="e.g., console.log('Hello, World!')"
            />
          </FormControl>
        </>
      )}

      {/* Content Form Fields */}
      {formType === 'Content' && (
        <>
          {/* File Input for ZIP */}
          <FormControl
            variant="standard"
            sx={{
              '& .MuiInput-underline:before': { borderColor: 'gray' },
              '& .MuiInput-underline:after': { borderColor: 'blue' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'blue' },
            }}
          >
            <InputLabel htmlFor="zip-input"></InputLabel>
            <Input
              id="zip-input"
              type="file"
              onChange={handleFileUpload}
              inputProps={{ accept: '.zip' }}
            />
          </FormControl>

          {/* JavaScript Program Input */}
          <FormControl
            variant="standard"
            sx={{
              '& .MuiInput-underline:before': { borderColor: 'gray' },
              '& .MuiInput-underline:after': { borderColor: 'blue' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'blue' },
            }}
          >
            <InputLabel htmlFor="js-program-input">JavaScript Program</InputLabel>
            <Input
              id="js-program-input"
              value={jsProgram}
              onChange={(e) => setJsProgram(e.target.value)}
              placeholder="e.g., console.log('Hello, World!')"
            />
          </FormControl>

          {/* Toggle for Debloat */}
          <FormControlLabel
            control={
              <Switch
                checked={debloat_}
                onChange={(e) => setDebloat(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Debloat"
            sx={{ marginTop: 1 }}
          />

          {/* Name Input */}
          <FormControl
            variant="standard"
            sx={{
              '& .MuiInput-underline:before': { borderColor: 'gray' },
              '& .MuiInput-underline:after': { borderColor: 'blue' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'blue' },
            }}
          >
            <InputLabel htmlFor="name-input">Name</InputLabel>
            <Input
              id="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Package Name"
            />
          </FormControl>
          <FormControl variant="standard">
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

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
}