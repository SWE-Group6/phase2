// Import the custom Purdue logo
import purdueLogo from '@/assets/images/icons/purdueLogo.jpeg';

const Logo = () => {
  return (
    // Render your custom logo
    <img
      src={purdueLogo}
      alt="Purdue Logo"
      style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
    />
  );
};

export default Logo;