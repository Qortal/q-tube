import { Avatar, useTheme } from "@mui/material";
import { AccountCircleSVG } from "../assets/svgs/AccountCircleSVG";
import { menuIconSize } from "../constants/Misc";
import {
  DropdownContainer,
  DropdownText,
  AvatarContainer
} from "./layout/Navbar/Navbar-styles";

interface UserDropDownProps {
  userName: string;
  handleMyChannelLink: (username: string) => void;
  popMenuRef: React.RefObject<{ closePopover: () => void }>;
}

export const UserDropDown = ({ userName, handleMyChannelLink, popMenuRef }: UserDropDownProps) => {
  const theme = useTheme();
  const userAvatar = `/arbitrary/THUMBNAIL/${userName}/avatar?async=true`;

  return (
      <DropdownContainer
        onClick={() => {
          handleMyChannelLink(userName);
          popMenuRef.current.closePopover();
        }}
      >
        <Avatar src={userAvatar}>
          {userName?.charAt(0).toUpperCase()}
        </Avatar>
        <DropdownText>{userName}</DropdownText>
      </DropdownContainer>
  )
} 

