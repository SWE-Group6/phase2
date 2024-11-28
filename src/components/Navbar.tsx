import React from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/packages" className="hover:underline">
            Packages
          </Link>
        </li>
        <li>
          <Link to="/options" className="hover:underline">
            Options
          </Link>
        </li>
      </ul>
      <UserButton />
    </nav>
  );
};

export default Navbar;
