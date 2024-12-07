import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Card, CardContent } from '@mui/material';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function ComposedTextField() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [metrics, setMetrics] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const rateAction = useAction(api.actions.ratePackage.ratePackage);

  const handleEnterPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputValue = (event.target as HTMLInputElement).value.trim();

      const [name, version] = inputValue.split(',').map(val => val.trim());

      if (name && version) {
        rateAction({name , version})
          .then((result) => {
            console.log("rating result:", result);
            if (inputRef.current) {
              inputRef.current.value = ''; // Clear the input field
            }
          })
          .catch((error) => console.error("Mutation failed:", error));
      } else {
        setError("Invalid input. Please provide both values in the format: 'name, url'.");
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1 } }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Enter Package Information (Format: Name, URL)
      </Typography>

      <FormControl variant="standard" sx={{ /* styling here */ }}>
        <InputLabel htmlFor="single-input">Package Information</InputLabel>
        <Input
          id="single-input"
          onFocus={() => console.log("Input focused")}
          onKeyDown={handleEnterPress}
          placeholder="e.g., jest, https://jest.com"
          inputRef={inputRef}
        />
      </FormControl>

      {metrics && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Calculated Metrics</Typography>
          <Card sx={{ maxWidth: 400, marginTop: 2 }}>
            <CardContent>
              <Typography variant="body1"><strong>Package Name:</strong> {metrics.packageName}</Typography>
              <Typography variant="body1"><strong>URL:</strong> {metrics.URL}</Typography>
              <Typography variant="body1"><strong>Metric Values:</strong> {metrics.metricValue}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {error && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="body1" color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
}
