import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from '@/store/constant';


// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// Convex imports
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  //const packageData = useQuery(api.queries.packageTable.getPackageById, {packageId: "jh7factmv6mjvd0knqqcd4p05175yq79"});
  const queryData = useQuery(api.queries.packageTable.getPackagesMetadata, {paginationOpts: {numItems: 20, cursor: null }, });
  const packageData = queryData?.packagesData || [];
  const packageNames = packageData?.map((pkg: any) => pkg.Name);

  useEffect(() => {
    if(!packageData.isLoading) {
      setLoading(false);
    }
  }, [packageData.isLoading]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[0]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[1]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[2]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[3]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[4]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[5]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[6]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[7]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[8]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[9]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[10]}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={packageNames[11]}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
