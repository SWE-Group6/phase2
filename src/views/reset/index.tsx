import React from 'react';
import { useAuth } from '@clerk/clerk-react';

const ResetButtonPage: React.FC = () => {
  const { getToken } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    try {
      const token = await getToken({template: "convex"});

      const response = await fetch(`/api/reset`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the data");
      }

      
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Failed to fetch the data. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Reset</button>
    </div>
  );
};

export default ResetButtonPage;