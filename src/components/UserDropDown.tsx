import { Avatar, useTheme } from "@mui/material";
import { AccountCircleSVG } from "../assets/svgs/AccountCircleSVG";
import { menuIconSize } from "../constants/Misc";
import { DropdownContainer, DropdownText } from "./layout/Navbar/Navbar-styles";

export const UserDropDown = ({ userName, handleMyChannelLink, popMenuRef }) => {
  const theme = useTheme();
  const userAvatar = `/arbitrary/THUMBNAIL/${userName}/avatar?async=true`;

  return (
    <>
      <DropdownContainer
        onClick={() => {
          handleMyChannelLink(userName);
          popMenuRef.current.closePopover();
        }}
      >
        {!userAvatar ? (
          <AccountCircleSVG
            color={theme.palette.text.primary}
            width={menuIconSize}
            height={menuIconSize}
          />
        ) : (
          <Avatar src={userAvatar}/>
        )}
        <DropdownText>{userName}</DropdownText>
      </DropdownContainer>
    </>
  )
} 

