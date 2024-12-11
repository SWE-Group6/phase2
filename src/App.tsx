import { Button, MenuList } from '@mui/material';
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider, useScrollTrigger } from '@mui/material';
import NavigationScroll from './layout/NavigationScroll';
import { useSelector } from "react-redux";
import router from './routes';
import themes from './themes';


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
            <RouterProvider router={router}/>
          </NavigationScroll>
        </ThemeProvider>
        </StyledEngineProvider>
      </Authenticated>
    </main>
 
  );
}

