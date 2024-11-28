import React from "react";

const PackageCard = ({ name, version }: { name: string; version: string }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold">{name || "Unknown Name"}</h2>
      <p className="text-sm text-gray-600">
        Version: {version || "Unknown Version"}
      </p>
    </div>
  );
};

export default PackageCard;
