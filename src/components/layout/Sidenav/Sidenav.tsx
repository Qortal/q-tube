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
import { useAuth } from 'qapp-core';
const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 68;

export const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = useAuth();
  const [isSideBarExpanded, setIsSideBarExpanded] = useAtom(
    isSideBarExpandedAtom
  );

  const drawerItems = useMemo(() => {
    return [
      {
        name: 'Home',
        icon: HomeIcon,
        path: '/',
      },
      {
        name: 'Subscriptions',
        icon: StarIcon,
        path: '/subscriptions',
      },
      {
        name: 'Watched videos',
        icon: AccessTimeIcon,
        path: '/history',
      },
      {
        name: 'Bookmarks',
        icon: BookmarksIcon,
        path: '/bookmarks',
      },
      {
        name: 'Your playlists',
        icon: PlaylistPlayIcon,
        path: `/channel/${name}/playlists`,
        disabled: !name,
      },
      {
        name: 'Your videos',
        icon: PlayCircleOutlineIcon,
        path: `/channel/${name}/videos`,
        disabled: !name,
      },
    ];
  }, [name]);

  return (
    <>
      <Drawer
        elevation={1}
        variant="permanent"
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            width: COLLAPSED_WIDTH,
            position: 'relative', // key change
            zIndex: 1200,
            top: '0px',
            bottom: 0,
            // overflow: 'hidden',
            bgcolor: 'background.default',
            borderRight: 'none',
          },
        }}
        open
      >
        <List>
          {drawerItems.map((item, index) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem
                key={item.name}
                disablePadding
                sx={{ display: 'block', padding: '5px' }}
              >
                <ListItemButton
                  disabled={item.disabled}
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
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
                  <ListItemText primary={item.name} sx={{ opacity: 0 }} />
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
              '& .MuiDrawer-paper': {
                width: isSideBarExpanded ? DRAWER_WIDTH : 0,
                transition: 'all 0.3s',
                opacity: isSideBarExpanded ? 1 : 0,
                position: 'fixed', // key change
                zIndex: 1200,
                top: '65px',
                bottom: 0,
                bgcolor: 'background.default',
                borderRight: 'none',
              },
            }}
            open
          >
            <List>
              {drawerItems.map((item, index) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem
                    key={item.name}
                    disablePadding
                    sx={{ display: 'block', padding: '5px' }}
                  >
                    <ListItemButton
                      onClick={() => navigate(item.path)}
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
                        sx={{ opacity: isSideBarExpanded ? 1 : 0 }}
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
