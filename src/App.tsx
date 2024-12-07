import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import router from './routes';
import themes from './themes';
import NavigationScroll from './layout/NavigationScroll';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInButton } from '@clerk/clerk-react'; // Import the SignInButton from Clerk
import { Button } from '@mui/material'; // Using Material UI Button for styling

export default function App() {
  const customization = useSelector((state: any) => state.customization);

  return (
    <main>
      <Unauthenticated>
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center">
          SWE Dashboard Login
        </h1>
        <div className="flex justify-center">
          {/* SignInButton from Clerk */}
          <SignInButton mode="modal">
            <Button variant="contained" color="primary">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </main>
      </Unauthenticated>
      <Authenticated>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <RouterProvider router={router} />
          </NavigationScroll>
        </ThemeProvider>
        </StyledEngineProvider>
      </Authenticated>
    </main>
 
  );
};