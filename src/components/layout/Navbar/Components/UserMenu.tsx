import { Popover, useMediaQuery, useTheme, Avatar } from '@mui/material';
import { AccountCircleSVG } from '../../../../assets/svgs/AccountCircleSVG.tsx';
import { headerIconSize, menuIconSize } from '../../../../constants/Misc.ts';
import { BlockedNamesModal } from '../../../common/BlockedNamesModal/BlockedNamesModal.tsx';
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
  NavbarName,
} from '../Navbar-styles.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCallback, useRef, useState } from 'react';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { RootState } from '../../../../state/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PopMenu, PopMenuRefType } from '../../../common/PopMenu.tsx';
import { UserDropDown } from '../../../UserDropDown.tsx';
import { Names } from '../../../../state/global/names.ts';
import { useAuth } from 'qapp-core';
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
  allNames,
}: NavBarMenuProps) => {
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  const theme = useTheme();
  const { switchName } = useAuth();
  const [isOpenBlockedNamesModal, setIsOpenBlockedNamesModal] =
    useState<boolean>(false);
  const popMenuRef = useRef<PopMenuRefType>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMyChannelLink = useCallback(
    (switchToName: string) => {
      switchName(switchToName);
      navigate(`/channel/${switchToName}`);
    },
    [navigate]
  );

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
                <Avatar src={userAvatar}>
                  {userName?.charAt(0).toUpperCase()}
                </Avatar>
              </AvatarContainer>
            }
          >
            {allNames.map((name) => (
              <UserDropDown
                key={name.name}
                userName={name.name}
                handleMyChannelLink={handleMyChannelLink}
                popMenuRef={popMenuRef}
              />
            ))}

            <DropdownContainer
              onClick={() => {
                setIsOpenBlockedNamesModal(true);
                popMenuRef.current.closePopover();
              }}
            >
              <PersonOffIcon
                sx={{
                  color: '#e35050',
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
