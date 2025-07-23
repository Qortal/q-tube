import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  ClickAwayListener,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { isSideBarExpandedAtom } from '../../../state/global/navbar';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Spacer, useAuth } from 'qapp-core';
import { useIsSmall } from '../../../hooks/useIsSmall';
import { UserMenu } from '../Navbar/Components/UserMenu';
import { DownloadTaskManager } from '../../common/DownloadTaskManager';
import { useTranslation } from 'react-i18next';
const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 68;

export const Sidenav = ({ allNames }) => {
  const { t } = useTranslation(['core']);

  const isSmall = useIsSmall();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, avatarUrl } = useAuth();
  const [isSideBarExpanded, setIsSideBarExpanded] = useAtom(
    isSideBarExpandedAtom
  );

  const isSecure = !!name;
  const drawerItems = useMemo(() => {
    return [
      {
        name: t('core:sidenav.home', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: HomeIcon,
        path: '/',
      },
      {
        name: t('core:sidenav.subscriptions', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: StarIcon,
        path: '/subscriptions',
      },
      {
        name: t('core:sidenav.watched_videos', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: AccessTimeIcon,
        path: '/history',
      },
      {
        name: t('core:sidenav.bookmarks', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: BookmarksIcon,
        path: '/bookmarks',
      },
      {
        name: t('core:sidenav.your_playlists', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: PlaylistPlayIcon,
        path: `/channel/${name}/playlists`,
        disabled: !name,
      },
      {
        name: t('core:sidenav.your_videos', {
          postProcess: 'capitalizeFirstChar',
        }),
        icon: PlayCircleOutlineIcon,
        path: `/channel/${name}/videos`,
        disabled: !name,
      },
    ];
  }, [name, t]);

  return (
    <>
      <Drawer
        elevation={1}
        variant="permanent"
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          '& .MuiDrawer-paper': {
            width: COLLAPSED_WIDTH,
            position: 'relative', // key change
            zIndex: 1200,
            top: '0px',
            bottom: 0,
            overflow: 'hidden',
            bgcolor: 'background.default',
            borderRight: 'none',
            ...(isSmall && {
              display: 'none',
            }),
          },
        }}
        open
      >
        <List
          sx={{
            overflow: 'hidden',
          }}
        >
          {drawerItems.map((item, index) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem
                key={item.name}
                disablePadding
                sx={{ display: 'block', padding: '5px', overflow: 'hidden' }}
              >
                <ListItemButton
                  disabled={item.disabled}
                  selected={isSelected}
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{
                    minHeight: 48,
                    padding: '12px 16px',
                    borderRadius: '4px',
                    justifyContent: 'center',
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <item.icon
                      sx={{
                        color: isSelected ? 'text.primary' : 'action.active',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      opacity: 0,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 5,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100vh',
          width: '100vw',
          display: isSideBarExpanded ? 'block' : 'none',
          overflow: 'hidden',
        }}
        onClick={() => {
          if (isSideBarExpanded) {
            setIsSideBarExpanded(false); // collapse the sidebar
          }
        }}
      />
      <ClickAwayListener
        onClickAway={() => {
          if (isSideBarExpanded) {
            setIsSideBarExpanded(false); // collapse the sidebar
          }
        }}
      >
        <>
          <Drawer
            elevation={1}
            variant="permanent"
            sx={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'opacity 0.3s',
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                left: isSideBarExpanded ? 0 : -100000,
                transition: 'opacity 0.3s',
                opacity: isSideBarExpanded ? 1 : 0,
                position: 'fixed', // key change
                zIndex: 1200,
                top: '60px',
                bottom: 0,
                bgcolor: 'background.default',
                borderRight: 'none',
                overFlow: 'hidden',
              },
            }}
            open
          >
            <List
              sx={{
                overflow: 'hidden',
              }}
            >
              {isSmall && (
                <>
                  <ListItem
                    disablePadding
                    sx={{ display: 'block', padding: '5px', gap: '5px' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <UserMenu
                        isShowMenu={isSecure}
                        userAvatar={avatarUrl}
                        userName={name}
                        allNames={allNames}
                      />
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {name}
                      </Typography>
                    </Box>
                  </ListItem>
                  <Spacer height="10px" />
                  <ListItem
                    disablePadding
                    sx={{ display: 'block', padding: '5px' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: '25px',
                      }}
                    >
                      <DownloadTaskManager />
                      <Typography>
                        {t('core:publish.downloads', {
                          postProcess: 'capitalizeFirstChar',
                        })}
                      </Typography>
                    </Box>
                  </ListItem>
                  <Divider />
                </>
              )}

              {drawerItems.map((item, index) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem
                    key={item.name}
                    disablePadding
                    sx={{
                      display: 'block',
                      padding: '5px',
                      overflow: 'hidden',
                    }}
                  >
                    <ListItemButton
                      onClick={() => {
                        setIsSideBarExpanded(false);
                        navigate(item.path);
                      }}
                      selected={isSelected}
                      sx={{
                        minHeight: 48,
                        padding: '12px 16px',
                        borderRadius: '4px',
                        justifyContent: isSideBarExpanded
                          ? 'initial'
                          : 'center',
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isSideBarExpanded ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <item.icon
                          sx={{
                            color: isSelected
                              ? 'text.primary'
                              : 'action.active',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        sx={{
                          opacity: isSideBarExpanded ? 1 : 0,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflow: 'hidden',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </>
      </ClickAwayListener>
    </>
  );
};
