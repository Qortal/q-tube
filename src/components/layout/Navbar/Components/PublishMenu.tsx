import { headerIconSize, menuIconSize } from '../../../../constants/Misc.ts';
import { StyledButton } from '../../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { PublishVideo } from '../../../Publish/PublishVideo/PublishVideo.tsx';
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
  NavbarName,
} from '../Navbar-styles.tsx';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { PopMenu, PopMenuRefType } from '../../../common/PopMenu.tsx';
import { useRef } from 'react';
import { Button, ButtonBase, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
export interface PublishButtonsProps {
  isDisplayed: boolean;
}
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { editPlaylistAtom } from '../../../../state/publish/playlist.ts';
import { useSetAtom } from 'jotai';
import { useIsSmall } from '../../../../hooks/useIsSmall.tsx';

export const PublishMenu = ({ isDisplayed }: PublishButtonsProps) => {
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
                >
                  Publish
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
              Playlist
            </StyledButton>
          </DropdownContainer>
        </PopMenu>
      )}
    </>
  );
};
