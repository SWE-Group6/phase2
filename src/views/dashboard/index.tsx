import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// project imports
import EarningCard from './EarningCard';
import { gridSpacing } from '@/store/constant';

// Convex imports
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [paginationOpts, setPaginationOpts] = useState({ numItems: 6, cursor: null });
  const [displayAll, setDisplayAll] = useState(false); // State to toggle between "Display All" and "Display Less"
  
  const queryData = useQuery(api.queries.packageTable.getPackagesMetadata, { paginationOpts });
  
  const isLoading = queryData === undefined;
  const packagesData = queryData?.packagesData || [];
  const nextCursor = queryData?.cursor;

  // Handle loading more data
  const loadMorePackages = () => {
    if (nextCursor) {
      setPaginationOpts({ numItems: 20, cursor: nextCursor });
    }
  };

  // Toggle display between "All" and "Less"
  const toggleDisplay = () => {
    if (displayAll) {
      // When clicking "Display Less", reset to initial 20 packages
      setPaginationOpts({ numItems: 6, cursor: null });
    } else {
      // When clicking "Display All", load all (or a large number)
      setPaginationOpts({ numItems: 1000, cursor: null }); 
    }
    setDisplayAll(!displayAll);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Dynamically render the EarningCards by looping through packageNames */}
          {packagesData.map((pkg: any, index: any) => (
            <Grid item lg={4} md={6} sm={6} xs={12} key={index}>
              <EarningCard isLoading={isLoading} name={pkg.Name} version={pkg.Version} id={pkg.ID}/>
            </Grid>
          ))}
        </Grid>
        
        {/* Toggle Display Button */}
        <Button 
          onClick={toggleDisplay} 
          variant="contained" 
          sx={{ marginTop: '16px', backgroundColor: '#364152'}}
        >
          {displayAll ? 'Display Less' : 'Display All'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Dashboard;