import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserButton, OrganizationProfile } from '@clerk/clerk-react';

// project imports
import MainCard from '@/components/cards/MainCard';
import Transitions from '@/components/extended/Transitions';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme: any = useTheme();
  const customization = useSelector((state: any) => state.customization);
  const navigate = useNavigate();
  const { user } = useUser();

  const [openOrgProfile, setOpenOrgProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleToggleOrgProfile = () => {
    setOpenOrgProfile((prev) => !prev);
  };

  useEffect(() => {
    const checkAdminRole = () => {
      if (user) {
        const orgId = 'org_2plow6YcQeyrrUQEzl72EzJQmDA';
        const membership = user.organizationMemberships.find(
          (membership) => membership.organization.id === orgId
        );
        setIsAdmin(membership?.role === "org:admin" as string);
      }
    };

    checkAdminRole();
  }, [user]);

  return (
    <>
      <UserButton afterSignOutUrl="#" />

      {/* Render the Organization Profile Button only if the user is an admin */}
      {isAdmin && (
        <Button
          variant="outlined"
          onClick={handleToggleOrgProfile}
          sx={{ ml: 2 }}
        >
          Manage Organization
        </Button>
      )}

      {openOrgProfile && (
        <Box
          sx={{
            position: 'absolute',
            top: '64px',
            right: '16px',
            zIndex: 1300,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            borderRadius: theme.shape.borderRadius,
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Organization Management
          </Typography>
          <OrganizationProfile />
        </Box>
      )}
    </>
  );
};

export default ProfileSection;
