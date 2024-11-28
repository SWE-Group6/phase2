import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PackageCard from "../components/PackageCard";

const Packages = () => {
  const packages = useQuery(api.packageTable.getPackagesMetadata) ?? [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg, index) => (
          <PackageCard key={index} name={pkg.Name} version={pkg.Version} />
        ))}
      </div>
    </div>
  );
};

export default Packages;
