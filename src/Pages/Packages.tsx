import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Packages = () => {
  // Provide default pagination options
  const paginationOpts = {
    cursor: null, // Start from the beginning
    numItems: 10, // Fetch up to 10 items
  };

  const packagesResponse = useQuery(api.queries.packageTable.getPackagesMetadata, {
    paginationOpts, // Pass the pagination options
    filters: {}, // Optional: Apply no filters
  });

  console.log("Packages Metadata:", packagesResponse);

  const packagesMetadata = packagesResponse?.packagesData || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Packages</h1>
      {packagesMetadata.length === 0 ? (
        <p className="text-gray-500">No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packagesMetadata.map((pkg: any) => (
            <div
              key={pkg.ID}
              className="bg-white shadow-md rounded-md p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold">{pkg.Name || "Unnamed"}</h2>
              <p className="text-gray-600">Version: {pkg.Version || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
