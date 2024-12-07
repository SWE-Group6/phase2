import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';

export default function ComposedTextField() {
  const deleteAction = useAction(api.actions.deletePackage.deletePackage);
  const inputRef = React.useRef<HTMLInputElement>(null); // Add a ref for the input field

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      const inputValue = (event.target as HTMLInputElement).value.trim();

      const [name, version] = inputValue.split(',').map(val => val.trim());

      if (name && version && URL) {
        console.log("Calling mutation...");
        deleteAction({ name, version})
          .then((result) => {
            console.log("Delete result:", result);
            if (inputRef.current) {
              inputRef.current.value = ''; // Clear the input field
            }
          })
          .catch((error) => console.error("Mutation failed:", error));
      } else {
        console.error("Invalid input. Please provide all three values (e.g., 'name, version, url').");
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      {/* Label above the inputs */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Enter Package Information (Format: Name, Version)
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
        <InputLabel htmlFor="single-input">Package Information</InputLabel>
        <Input
          id="single-input"
          onFocus={() => console.log("Input focused")}
          onKeyDown={handleEnterPress}
          placeholder="e.g., jest, 1.0.2"
          inputRef={inputRef} 
        />
      </FormControl>
    </Box>
  );
}
