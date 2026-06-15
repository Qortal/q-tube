import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Button, ButtonBase, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { menuIconSize } from '../../../../constants/Misc.ts';
import { useIsSmall } from '../../../../hooks/useIsSmall.tsx';
import { editPlaylistAtom } from '../../../../state/publish/playlist.ts';
import { PopMenu, PopMenuRefType } from '../../../common/PopMenu.tsx';
import { StyledButton } from '../../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { PublishVideo } from '../../../Publish/PublishVideo/PublishVideo.tsx';
import { DropdownContainer } from '../Navbar-styles.tsx';

export interface PublishButtonsProps {
  isDisplayed: boolean;
}

export const PublishMenu = ({ isDisplayed }: PublishButtonsProps) => {
  const { t } = useTranslation(['core']);

  const popMenuRef = useRef<PopMenuRefType>(null);
  const setEditPlaylist = useSetAtom(editPlaylistAtom);
  const isSmall = useIsSmall();
  const theme = useTheme();
  return (
    <>
      {isDisplayed && (
        <PopMenu
          showExpandIcon={false}
          MenuHeader={
            <>
              {!isSmall ? (
                <Button
                  startIcon={<AddIcon />}
                  color="info"
                  variant="contained"
                  sx={{ color: 'white' }}
                >
                  {t('core:publish.publish_action', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Button>
              ) : (
                <ButtonBase>
                  <AddIcon
                    sx={{
                      fontSize: '35px',
                      color: theme.palette.action.active,
                    }}
                  />
                </ButtonBase>
              )}

              {/* {!isScreenSmall && (
                <NavbarName sx={{ marginRight: '5px' }}>Publish</NavbarName>
              )}
              <AddBoxIcon
                sx={{
                  color: 'DarkGreen',
                  width: headerIconSize,
                  height: headerIconSize,
                }}
              /> */}
            </>
          }
          ref={popMenuRef}
        >
          <DropdownContainer>
            <PublishVideo afterClose={popMenuRef?.current?.closePopover} />
          </DropdownContainer>
          <DropdownContainer onClick={popMenuRef?.current?.closePopover}>
            <StyledButton
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                width: '100%',
              }}
              startIcon={
                <PlaylistAddIcon
                  sx={{
                    color: '#00BFFF',
                    width: menuIconSize,
                    height: menuIconSize,
                  }}
                />
              }
              onClick={() => {
                setEditPlaylist({ mode: 'new' });
              }}
            >
              {t('core:publish.playlist', {
                postProcess: 'capitalizeFirstChar',
              })}
            </StyledButton>
          </DropdownContainer>
        </PopMenu>
      )}
    </>
  );
};
