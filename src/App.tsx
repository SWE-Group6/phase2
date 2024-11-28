import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import Packages from "./Pages/Packages";

export default function App() {
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
}