import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Avatar, useTheme } from '@mui/material';
import { useAuth } from 'qapp-core';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { menuIconSize } from '../../../../constants/Misc.ts';
import { useIsSmall } from '../../../../hooks/useIsSmall.tsx';
import { Names } from '../../../../state/global/names.ts';
import { BlockedNamesModal } from '../../../common/BlockedNamesModal/BlockedNamesModal.tsx';
import { PopMenu, PopMenuRefType } from '../../../common/PopMenu.tsx';
import { UserDropDown } from '../../../UserDropDown.tsx';
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
} from '../Navbar-styles.tsx';

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
  const { t } = useTranslation(['core']);

  const isSmall = useIsSmall();
  const theme = useTheme();
  const { switchName } = useAuth();
  const [isOpenBlockedNamesModal, setIsOpenBlockedNamesModal] =
    useState<boolean>(false);
  const popMenuRef = useRef<PopMenuRefType>(null);
  const constructedAvatarUrl = `/arbitrary/THUMBNAIL/${encodeURIComponent(userName || '')}/qortal_avatar`;

  const handleMyChannelLink = useCallback(
    (switchToName: string) => {
      switchName(switchToName);
    },
    []
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
                }}
              >
                <Avatar
                  sx={{
                    height: isSmall ? '35px' : '40px',
                    width: isSmall ? '35px' : '40px',
                  }}
                  src={userAvatar || constructedAvatarUrl}
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
                popMenuRef={popMenuRef as React.RefObject<{ closePopover: () => void }>}
              />
            ))}

            <DropdownContainer
              onClick={() => {
                setIsOpenBlockedNamesModal(true);
                popMenuRef.current?.closePopover();
              }}
            >
              <PersonOffIcon
                sx={{
                  color: '#e35050',
                  width: menuIconSize,
                  height: menuIconSize,
                }}
              />
              <DropdownText>
                {' '}
                {t('core:blocked.blocked_names', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
              </DropdownText>
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
