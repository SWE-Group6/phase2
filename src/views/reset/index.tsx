import React from 'react';

const ResetButtonPage: React.FC = () => {
  const handleClick = () => {
    console.log('Reset button clicked');
  };

  return (
    <div>
      <button onClick={handleClick}>Reset</button>
    </div>
  );
};

export default ResetButtonPage;