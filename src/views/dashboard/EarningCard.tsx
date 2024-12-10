import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from '@/components/cards/MainCard';
import SkeletonEarningCard from '@/components/cards/Skeleton/EarningCard';

// assets
import EarningIcon from '@/assets/images/icons/npm.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({
  isLoading,
  name,
  version, // New prop for version
  id, // New prop for ID
}: {
  isLoading: boolean;
  name: string;
  version: string; // New prop type
  id: string; // New prop type
}) => {
  const theme: any = useTheme();

  // State for toggling the visibility of the information box
  const [showInfo, setShowInfo] = React.useState(false);

  // State for displaying fetched information
  const [fetchedInfo, setFetchedInfo] = React.useState<any | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);

  // Mock query function to simulate data fetching
  const fetchData = async () => {
    setIsFetching(true);

    // Simulated delay to mimic a query call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Replace this with actual data fetched from your query
    const pseudoData = {
      usageCount: 150,
      lastUpdated: '2024-12-01',
      activeUsers: 32,
    };

    setFetchedInfo(pseudoData);
    setIsFetching(false);
  };

  React.useEffect(() => {
    // Automatically fetch data when the component mounts
    fetchData();
  }, []);

  const handleAvatarClick = () => {
    setShowInfo((prev) => !prev); // Toggle the visibility of the info box
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            backgroundColor: theme.palette.grey[700],
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.grey[900],
              borderRadius: '50%',
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 },
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.warning.dark,
              borderRadius: '50%',
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5,
            },
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: '#364152',
                        mt: 1,
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" style={{ width: '100%', height: '100%' }} />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        bgcolor: '#364152',
                        color: '#121926',
                        zIndex: 1,
                      }}
                      onClick={handleAvatarClick} // Click event to toggle info visibility
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '1.225rem',
                    fontWeight: 500,
                    mt: 1.75,
                    mb: 0.75,
                  }}
                >
                  {name}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Info box that appears when avatar is clicked */}
          {showInfo && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                padding: 2,
                backgroundColor: theme.palette.background.paper,
                borderRadius: '10px',
                boxShadow: 3,
                zIndex: 2,
              }}
            >
              {isFetching ? (
                <Typography sx={{ fontSize: '0.875rem', color: theme.palette.grey[900] }}>
                  Fetching information...
                </Typography>
              ) : fetchedInfo ? (
                <Box>
                  {/* Display new version and id props */}
                  <Typography sx={{ fontSize: '0.875rem', color: theme.palette.grey[900], mb: 1 }}>
                    <strong>Version:</strong> {version}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: theme.palette.grey[900] }}>
                    <strong>ID:</strong> {id}
                  </Typography>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.875rem', color: theme.palette.error.main }}>
                  Failed to load information.
                </Typography>
              )}
            </Box>
          )}
        </MainCard>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
  name: PropTypes.string,
  version: PropTypes.string, // Added version prop type
  id: PropTypes.string, // Added id prop type
};

export default EarningCard;
