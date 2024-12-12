import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useAuth } from '@clerk/clerk-react';
import { BusFactor } from '../../../convex/package_rate/Models/BusFactor';

export default function Rate() {
  const [packageID, setPackageID] = React.useState<string>('');
  const [metrics, setMetrics] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    const trimmedPackageID = packageID.trim();

    if (trimmedPackageID) {
      try {
        // Set loading to true before API call
        setIsLoading(true);
        setError(null); // Clear any previous errors

        const token = await getToken({template: "convex"});

        const response = await fetch(`${import.meta.env.VITE_CONVEX_HTTP_URL}/package/${trimmedPackageID}/rate`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
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
      } finally {
        // Set loading to false after API call completes
        setIsLoading(false);
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

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>

      {/* Loading Spinner */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {metrics && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Package Metrics</Typography>
          <Card sx={{ maxWidth: 400, marginTop: 2 }}>
            <CardContent>
              <Typography variant="body1"><strong>Package ID:</strong> {packageID}</Typography>
              <Typography variant="body1"><strong>NetScore:</strong> {metrics.NetScore}</Typography>
              <Typography variant="body1"><strong>BusFactor:</strong> {metrics.BusFactor}</Typography>
              <Typography variant="body1"><strong>Correctness:</strong> {metrics.Correctness}</Typography>
              <Typography variant="body1"><strong>ResponsiveMaintainer:</strong> {metrics.ResponsiveMaintainer}</Typography>
              <Typography variant="body1"><strong>RampUp:</strong> {metrics.RampUp}</Typography>
              <Typography variant="body1"><strong>LicenseScore:</strong> {metrics.LicenseScore}</Typography>
              <Typography variant="body1"><strong>PulledCode:</strong> {metrics.PulledCode}</Typography>
              <Typography variant="body1"><strong>DependencyPinning:</strong> {metrics.DependencyPinning}</Typography>
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
