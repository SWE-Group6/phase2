import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

export default function ComposedTextField() {
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      {/* Label above the inputs */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Enter Package Information
      </Typography>

      <FormControl
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': {
            borderColor: 'gray', // Default color
          },
          '& .MuiInput-underline:after': {
            borderColor: 'blue', // Focused color
          },
          '& .MuiInputLabel-root': {
            color: 'gray', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'blue', // Focused label color
          },
        }}
      >
        <InputLabel htmlFor="component-simple">Name</InputLabel>
        <Input id="component-simple" defaultValue="Composed TextField" />
      </FormControl>

      <FormControl
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': {
            borderColor: 'gray', // Default color
          },
          '& .MuiInput-underline:after': {
            borderColor: 'blue', // Focused color
          },
          '& .MuiInputLabel-root': {
            color: 'gray', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'blue', // Focused label color
          },
        }}
      >
        <InputLabel htmlFor="component-helper">Url</InputLabel>
        <Input
          id="component-helper"
          defaultValue="Composed TextField"
          aria-describedby="component-helper-text"
        />
      </FormControl>
      <FormControl
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': {
            borderColor: 'gray', // Default color
          },
          '& .MuiInput-underline:after': {
            borderColor: 'blue', // Focused color
          },
          '& .MuiInputLabel-root': {
            color: 'gray', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'blue', // Focused label color
          },
        }}
      >
        <InputLabel htmlFor="component-helper">Content</InputLabel>
        <Input
          id="component-helper"
          defaultValue="Composed TextField"
          aria-describedby="component-helper-text"
        />
      </FormControl>
    </Box>
  );
}
