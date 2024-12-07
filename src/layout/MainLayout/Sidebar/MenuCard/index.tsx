import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
  const theme: any = useTheme();

  return (
    <Card
    sx={{
      bgcolor: 'primary.light',
      mb: 2.75,
      overflow: 'hidden',
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        width: 157,
        height: 157,
        bgcolor: 'primary.200',
        borderRadius: '50%',
        top: -105,
        right: -96
      }
    }}
  >
    <Box sx={{ p: 2 }}>
      <List disablePadding sx={{ m: 0 }}>
        <ListItem alignItems="flex-start" disableGutters disablePadding>
          <ListItemAvatar sx={{ mt: 0 }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.largeAvatar,
                color: 'primary.main',
                border: 'none',
                borderColor: 'primary.main',
                bgcolor: 'background.paper'
              }}
            >
              <TableChartOutlinedIcon fontSize="inherit" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ mt: 0 }}
            primary={
              <Typography variant="subtitle1" sx={{ color: 'primary.800' }}>
                Get Extra Space
              </Typography>
            }
            secondary={<Typography variant="caption"> 28/23 GB</Typography>}
          />
        </ListItem>
      </List>
    </Box>
  </Card>
  );
};

export default memo(MenuCard);