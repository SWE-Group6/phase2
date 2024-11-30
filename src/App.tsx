import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import Packages from "./Pages/Packages";
import { Button } from "@/components/ui/button";
// routing
import router from '@/routes';

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";

// defaultTheme
import themes from '@/themes';
import Sidebar from './layout/MainLayout/Sidebar';

import { useDispatch} from 'react-redux';
import { styled, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SET_MENU } from "@/store/actions";
import { drawerWidth } from "@/store/constant";
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// project imports
import NavigationScroll from '@/layout/NavigationScroll';

export default function App() {
  const customization = useSelector((state: any) => state.customization);

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state: any) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  return (
    <Router>
      {/* Render the unauthenticated view first */}
      <Unauthenticated>
        <main className="container max-w-2xl flex flex-col gap-8">
          <h1 className="text-4xl font-extrabold my-8 text-center">
            SWE Dashboard Login
          </h1>
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          </div>
        </main>
      </Unauthenticated>
      
      {/* Render the authenticated view */}
      <Authenticated>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/options" element={<div>Options Page</div>} />
          </Routes>
        </Layout>
      </Authenticated>
    </Router>
  );
};
