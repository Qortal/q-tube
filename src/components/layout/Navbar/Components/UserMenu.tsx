import { Popover, useMediaQuery, useTheme } from "@mui/material";
import { AccountCircleSVG } from "../../../../assets/svgs/AccountCircleSVG.tsx";
import { headerIconSize, menuIconSize } from "../../../../constants/Misc.ts";
import { BlockedNamesModal } from "../../../common/BlockedNamesModal/BlockedNamesModal.tsx";
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
  NavbarName,
} from "../Navbar-styles.tsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCallback, useRef, useState } from "react";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useNavigate } from "react-router-dom";
import { PopMenu, PopMenuRefType } from "../../../common/PopMenu.tsx";
import { UserDropDown } from "../../../UserDropDown.tsx";
import { Names } from "../../../../state/global/names.ts";
export interface NavBarMenuProps {
  isShowMenu: boolean;
  userAvatar: string;
  userName: string | null;
  allNames: Names;
}

export const UserMenu = ({
  isShowMenu,
  userAvatar,
  userName,
  allNames
}: NavBarMenuProps) => {
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  const theme = useTheme();

  const [isOpenBlockedNamesModal, setIsOpenBlockedNamesModal] =
    useState<boolean>(false);
  const popMenuRef = useRef<PopMenuRefType>(null);
  const navigate = useNavigate();

  const handleMyChannelLink = useCallback((switchToName) => {
    userName = switchToName;
    navigate(`/channel/${switchToName}`);
  }, [navigate]);

  const onCloseBlockedNames = () => {
    setIsOpenBlockedNamesModal(false);
  };

  return (
    <>
      {isShowMenu && (    
        <>
          <PopMenu
            ref={popMenuRef}
            MenuHeader={
              <AvatarContainer>
                {!isScreenSmall && <NavbarName>{userName}</NavbarName>}
                {!userAvatar ? (
                  <AccountCircleSVG
                    color={theme.palette.text.primary}
                    width={headerIconSize}
                    height={headerIconSize}
                  />
                ) : (
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    width={headerIconSize}
                    height={headerIconSize}
                    style={{
                      borderRadius: "50%",
                    }}
                  />
                )}
              </AvatarContainer>
            }
          >
          
            {
              allNames.map((name) => (
                <UserDropDown key={name.name}
                  userName={name.name}
                  handleMyChannelLink={handleMyChannelLink}
                  popMenuRef={popMenuRef}
                />
              ))
            }

            <DropdownContainer
              onClick={() => {
                setIsOpenBlockedNamesModal(true);
                popMenuRef.current.closePopover();
              }}
            >
              <PersonOffIcon
                sx={{
                  color: "#e35050",
                  width: menuIconSize,
                  height: menuIconSize,
                }}
              />
              <DropdownText>Blocked Names</DropdownText>
            </DropdownContainer>
          </PopMenu>
          {isOpenBlockedNamesModal && (
            <BlockedNamesModal
              open={isOpenBlockedNamesModal}
              onClose={onCloseBlockedNames}
            />
          )}
        </>
      )}
    </>
  );
};
