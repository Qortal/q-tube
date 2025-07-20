import { useMediaQuery, useTheme, Avatar } from '@mui/material';
import { menuIconSize } from '../../../../constants/Misc.ts';
import { BlockedNamesModal } from '../../../common/BlockedNamesModal/BlockedNamesModal.tsx';
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
  NavbarName,
} from '../Navbar-styles.tsx';
import { useCallback, useRef, useState } from 'react';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useNavigate } from 'react-router-dom';
import { PopMenu, PopMenuRefType } from '../../../common/PopMenu.tsx';
import { UserDropDown } from '../../../UserDropDown.tsx';
import { Names } from '../../../../state/global/names.ts';
import { useAuth } from 'qapp-core';
import { useIsSmall } from '../../../../hooks/useIsSmall.tsx';
export interface NavBarMenuProps {
  isShowMenu: boolean;
  userAvatar: string | null;
  userName: string | null;
  allNames: Names;
}

export const UserMenu = ({
  isShowMenu,
  userAvatar,
  userName,
  allNames,
}: NavBarMenuProps) => {
  const isSmall = useIsSmall();
  const theme = useTheme();
  const { switchName } = useAuth();
  const [isOpenBlockedNamesModal, setIsOpenBlockedNamesModal] =
    useState<boolean>(false);
  const popMenuRef = useRef<PopMenuRefType>(null);
  const navigate = useNavigate();

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
              <AvatarContainer
                sx={{
                  height: isSmall ? '35px' : '40px',
                  width: isSmall ? '35px' : '40px',
                }}
              >
                <Avatar
                  sx={{
                    height: isSmall ? '35px' : '40px',
                    width: isSmall ? '35px' : '40px',
                  }}
                  src={userAvatar || ''}
                >
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
