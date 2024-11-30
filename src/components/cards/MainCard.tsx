import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@emotion/react';

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

type MainCardProps = {
  children: React.ReactNode;
  border?: boolean;
  boxShadow?: string | boolean;
  content?: boolean;
  contentClass?: string;
  contentSX?: React.CSSProperties;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  shadow?: boolean;
  sx?: SxProps<Theme>;
  title?: React.ReactNode;
  elevation?: number;
};

const MainCard: React.FC<MainCardProps> = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      children,
      border = false,
      boxShadow = false,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme: any = useTheme();
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: 'divider',
          ':hover': {
            boxShadow:
              boxShadow || shadow
                ? '0 2px 14px 0 rgb(32 40 45 / 8%)'
                : 'inherit',
          },
          backgroundColor: theme.palette.secondary.dark,
          ...sx,
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.node,
  shadow: PropTypes.bool,
  sx: PropTypes.object,
  title: PropTypes.node,
};

export default MainCard;
