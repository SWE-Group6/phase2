import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('@/views/dashboard')));

// actions routing
const UploadPage = Loadable(lazy(() => import('@/views/upload')));
const UpdatePage = Loadable(lazy(() => import('@/views/update')));
const RatePage = Loadable(lazy(() => import('@/views/rate')));
const ResetPage = Loadable(lazy(() => import('@/views/reset')));


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
          path: 'update',
          element: <UpdatePage />
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
  ]
};

export default MainRoutes;