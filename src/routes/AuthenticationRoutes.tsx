import { lazy } from 'react';

// project imports
import Loadable from '@/components/Loadable';
import MinimalLayout from '@/layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('@/views/login')));


// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login/login3',
      element: <AuthLogin3 />
    },
  ]
};

export default AuthenticationRoutes;