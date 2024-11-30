import PropTypes from 'prop-types';

// material-ui
import MuiAvatar from '@mui/material/Avatar';
import { Link, LinkProps } from '@mui/material';
// ==============================|| AVATAR ||============================== //

interface AvatarProps {
  color?: string;
  outline?: boolean;
  size?: string;
  sx?: any;
  children?: React.ReactNode;
  component?: React.ElementType;  
  href?: string;
  ariaLabel?: string;
  target?: string;
  alt?: string;
  others?: any;
}

const Avatar: React.FC<AvatarProps> = ({ color,
  outline,
  size,
  sx,
  component: Component = 'div', 
  href,
  ariaLabel,
  target,
  alt,
  children,
  ...others }) => {
  const colorSX = color && !outline && { color: 'background.paper', bgcolor: `${color}.main` };
  const outlineSX = outline && {
    color: color ? `${color}.main` : `primary.main`,
    bgcolor: 'background.paper',
    border: '2px solid',
    borderColor: color ? `${color}.main` : `primary.main`
  };
  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = { width: 28, height: 28 };
      break;
    case 'xs':
      sizeSX = { width: 34, height: 34 };
      break;
    case 'sm':
      sizeSX = { width: 40, height: 40 };
      break;
    case 'lg':
      sizeSX = { width: 72, height: 72 };
      break;
    case 'xl':
      sizeSX = { width: 82, height: 82 };
      break;
    case 'md':
      sizeSX = { width: 60, height: 60 };
      break;
    default:
      sizeSX = {};
  }

  return <MuiAvatar sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />;
};

Avatar.propTypes = {
  color: PropTypes.string,
  outline: PropTypes.bool,
  size: PropTypes.string,
  sx: PropTypes.object
};

export default Avatar;