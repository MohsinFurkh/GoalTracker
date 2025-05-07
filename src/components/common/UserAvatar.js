import React from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';

/**
 * Generate a consistent color based on a string
 * @param {string} string - The input string to generate color from
 * @returns {string} - The hex color code
 */
function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

/**
 * Generate avatar props based on a name
 * @param {string} name - The name to use for the avatar
 * @returns {object} - Props for the Avatar component
 */
function stringAvatar(name) {
  const nameParts = name.split(' ');
  let initials;
  
  if (nameParts.length >= 2) {
    initials = `${nameParts[0][0]}${nameParts[1][0]}`;
  } else if (name.length >= 2) {
    initials = `${name[0]}${name[1]}`;
  } else if (name.length === 1) {
    initials = name[0];
  } else {
    initials = '?';
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}

/**
 * UserAvatar - A component for displaying user avatars
 * 
 * @param {object} props - Component props
 * @param {string} props.name - User's name
 * @param {string} [props.src] - Image source URL
 * @param {number} [props.size=40] - Avatar size in pixels
 * @param {boolean} [props.tooltip=false] - Whether to show name tooltip
 * @param {object} [props.sx] - Additional Material UI styles
 */
export default function UserAvatar({ name, src, size = 40, tooltip = false, sx = {} }) {
  const avatarComponent = (
    <Avatar
      src={src}
      alt={name}
      {...(!src && name ? stringAvatar(name) : {})}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        ...sx,
      }}
    />
  );

  if (tooltip && name) {
    return (
      <Tooltip title={name} arrow>
        <Box component="span" sx={{ display: 'inline-block' }}>
          {avatarComponent}
        </Box>
      </Tooltip>
    );
  }

  return avatarComponent;
}