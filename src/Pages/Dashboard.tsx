import React from "react";
import { Link } from "react-router-dom";

import { UserButton, useAuth } from "@clerk/clerk-react";

const Dashboard = () => {
  const { isSignedIn } = useAuth();


  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <Link to="/packages" className="text-blue-500 underline">
              View Packages
            </Link>
          </li>
          <li>
            <Link to="/options" className="text-blue-500 underline">
              View Options
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Dashboard;