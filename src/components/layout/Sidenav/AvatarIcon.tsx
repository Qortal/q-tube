import { Avatar } from '@mui/material';
import { useAuth } from 'qapp-core';

export const AvatarIcon = () => {
  const { name, avatarUrl } = useAuth();
  const userAvatar = `/arbitrary/THUMBNAIL/${encodeURIComponent(name || '')}/avatar?async=true`;

  return (
    <Avatar
      src={avatarUrl || userAvatar}
      sx={{
        width: 24,
        height: 24,
      }}
    >
      {name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};