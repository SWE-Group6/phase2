import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button, Card, CardContent } from '@mui/material';
import { useAuth } from '@clerk/clerk-react';

export default function Rate() {
  const [packageID, setPackageID] = React.useState<string>('');
  const [metrics, setMetrics] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    const trimmedPackageID = packageID.trim();

    if (trimmedPackageID) {
      try {
        const token = await getToken({template: "convex"});

        const response = await fetch(`/api/package/${trimmedPackageID}/rate`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the data");
        }

        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to fetch the data. Please try again.');
      }
    } else {
      setError('Invalid input. Please provide a valid Package ID.');
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
        Enter Package ID
      </Typography>

      <FormControl variant="standard" sx={{ marginBottom: 2 }}>
        <InputLabel htmlFor="package-id-input">Package ID</InputLabel>
        <Input
          id="package-id-input"
          value={packageID}
          onChange={(e) => setPackageID(e.target.value)}
          placeholder="e.g., jd786xjenm4zmjkb89pr79ndm5766s3d"
        />
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

      {metrics && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Package Metrics</Typography>
          <Card sx={{ maxWidth: 400, marginTop: 2 }}>
            <CardContent>
              <Typography variant="body1"><strong>Package ID:</strong> {packageID}</Typography>
              <Typography variant="body1"><strong>Metric Values:</strong> {metrics.NetScore}</Typography>
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
