import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('@/views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('@/views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('@/views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('@/views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('@/views/sample-page')));

const UploadPage = Loadable(lazy(() => import('@/views/Upload')));
const DeletePage = Loadable(lazy(() => import('@/views/Delete')));
const RatePage = Loadable(lazy(() => import('@/views/Rate')));
const ResetPage = Loadable(lazy(() => import('@/views/Reset')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'actions',
      children: [
        {
          path: 'upload',
          element: <UploadPage />
        }
      ]
    },
    {
      path: 'actions',
      children: [
        {
          path: 'delete',
          element: <DeletePage />
        }
      ]
    },
    {
      path: 'actions',
      children: [
        {
          path: 'rate',
          element: <RatePage />
        }
      ]
    },
    {
      path: 'actions',
      children: [
        {
          path: 'reset',
          element: <ResetPage />
        }
      ]
    },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;