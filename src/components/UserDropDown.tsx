import { Avatar, useTheme } from '@mui/material';
import { DropdownContainer, DropdownText } from './layout/Navbar/Navbar-styles';

interface UserDropDownProps {
  userName: string;
  handleMyChannelLink: (username: string) => void;
  popMenuRef: React.RefObject<{ closePopover: () => void }>;
}

export const UserDropDown = ({
  userName,
  handleMyChannelLink,
  popMenuRef,
}: UserDropDownProps) => {
  const theme = useTheme();
  const userAvatar = `/arbitrary/THUMBNAIL/${encodeURIComponent(userName)}/qortal_avatar`;

  return (
    <DropdownContainer
      onClick={() => {
        handleMyChannelLink(userName);
        popMenuRef.current?.closePopover();
      }}
    >
      <Avatar
        src={userAvatar}
        alt={`${userName}'s avatar`}
        imgProps={{
          onError: (e) => {
            e.currentTarget.src = '';
          },
        }}
      >
        {userName?.charAt(0).toUpperCase()}
      </Avatar>
      <DropdownText>{userName}</DropdownText>
    </DropdownContainer>
  );
};
