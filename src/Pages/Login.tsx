import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-extrabold mb-8">SWE Dashboard Login</h1>
      <SignInButton mode="modal">
        <Button>Log in</Button>
      </SignInButton>
    </div>
  );
}
