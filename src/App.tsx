import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  return (
    <main className="container max-w-2xl flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold my-8 text-center">
        Convex + React (Vite) + Clerk Auth
      </h1>
      <Authenticated>
        <SignedIn />
      </Authenticated>
      <Unauthenticated>
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
    </main>
  );
}

function SignedIn() {
  return (
    <>
      <p>Welcome to the application!</p>
    </>
  );
}
