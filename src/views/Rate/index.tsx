import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button, Card, CardContent } from '@mui/material';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function ComposedTextField() {
  const [name, setName] = React.useState<string>('');
  const [url, setUrl] = React.useState<string>('');
  const [metrics, setMetrics] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const rateAction = useAction(api.actions.ratePackage.ratePackage);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (trimmedName && trimmedUrl) {
      rateAction({ name: trimmedName, version: trimmedUrl })
        .then((result) => {
          console.log('rating result:', result);
          setName(''); // Clear the name input
          setUrl('');  // Clear the URL input
        })
        .catch((error) => console.error('Mutation failed:', error));
    } else {
      setError('Invalid input. Please provide both Name and URL.');
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
        Enter Package Information
      </Typography>

      <FormControl variant="standard" sx={{ marginBottom: 2 }}>
        <InputLabel htmlFor="name-input">Package Name</InputLabel>
        <Input
          id="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., jest"
        />
      </FormControl>

      <FormControl variant="standard" sx={{ marginBottom: 2 }}>
        <InputLabel htmlFor="url-input">Package URL</InputLabel>
        <Input
          id="url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://jest.com"
        />
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

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
