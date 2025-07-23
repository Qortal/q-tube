import React, { useEffect, useMemo, useRef, useState } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  ClickAwayListener,
  Divider,
  Drawer,
  TextField,
  Typography,
  useTheme,
  Checkbox,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { InstallDesktopRounded } from '@mui/icons-material';
import { usePersistedState } from '../../../state/persist/persist';
import ShortUniqueId from 'short-unique-id';
import { Spacer, useGlobal } from 'qapp-core';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from './CustomTooltip';

const uid = new ShortUniqueId({ length: 15, dictionary: 'alphanum' });

export const AddToBookmarks = ({ metadataReference }) => {
  const { t } = useTranslation(['core']);

  const { lists: globalLists } = useGlobal();
  const [bookmarks, setBookmarks, isHydratedSubscriptions] = usePersistedState(
    'bookmarks-v1',
    {}
  );
  const [bookmarkList, setBookmarkList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(1);
  const [title, setTitle] = useState('');
  const theme = useTheme();
  const inputRef = useRef(null);

  const ref = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      ref?.current?.focus();
    }
  }, [isOpen]);

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget) && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (mode !== 2) return;
    inputRef.current?.focus();
  }, [mode]);

  const handleCreateList = () => {
    const newId = uid.rnd();
    setBookmarks((prev) => {
      return {
        ...prev,
        [newId]: {
          id: newId,
          title: title,
          description: '',
          created: Date.now(),
          updated: Date.now(),
          lastAdded: 0,
          videos: [],
          lastAccessed: 0,
          type: 'list', // list, playlist, folder
          playlistReference: null,
          folderName: null,
        },
      };
    });
    setMode(1);
    setTitle('');
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter' && title?.trim()) {
      handleCreateList();
    }
  };

  const handleAddVideoToList = (
    listId: string,
    video: {
      name: string;
      identifier: string;
      service: string;
    }
  ) => {
    globalLists.deleteList('bookmarks-all');
    globalLists.deleteList(`bookmarks-all-${listId}`);
    setBookmarks((prev) => {
      const list = prev[listId];
      if (!list || list.type !== 'list') return prev;

      const videoExists = list.videos.some(
        (v) =>
          v.name === video.name &&
          v.identifier === video.identifier &&
          v.service === video.service
      );

      if (videoExists) return prev;

      const newVideo = {
        ...video,
        addedAt: Date.now(),
        created: Date.now(),
        size: 200,
      };

      return {
        ...prev,
        [listId]: {
          ...list,
          videos: [...list.videos, newVideo],
          updated: Date.now(),
        },
      };
    });
  };

  const handleRemoveVideoFromList = (
    listId: string,
    video: {
      name: string;
      identifier: string;
      service: string;
    }
  ) => {
    setBookmarks((prev) => {
      const list = prev[listId];
      if (!list || list.type !== 'list') return prev;

      const updatedVideos = list.videos.filter(
        (v) =>
          !(
            v.name === video.name &&
            v.identifier === video.identifier &&
            v.service === video.service
          )
      );
      // If no change, avoid unnecessary update
      if (updatedVideos.length === list.videos.length) return prev;

      return {
        ...prev,
        [listId]: {
          ...list,
          videos: updatedVideos,
          updated: Date.now(),
        },
      };
    });
  };

  const isVideoInList = (
    listId: string,
    video: { name: string; identifier: string; service: string }
  ): boolean => {
    const list = bookmarks[listId];
    if (!list || list.type !== 'list') return false;

    return list.videos.some(
      (v) =>
        v.name === video.name &&
        v.identifier === video.identifier &&
        v.service === video.service
    );
  };

  const isVideoInAnyList = (video: {
    name: string;
    identifier: string;
    service: string;
  }): boolean => {
    return Object.values(bookmarks).some(
      (b) =>
        b.type === 'list' &&
        b.videos.some(
          (v) =>
            v.name === video.name &&
            v.identifier === video.identifier &&
            v.service === video.service
        )
    );
  };

  const isInABookmark = useMemo(() => {
    return isVideoInAnyList(metadataReference);
  }, [bookmarks]);

  const lists = Object.values(bookmarks)
    .filter((bookmark) => bookmark?.type === 'list' && !!bookmark?.title)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <CustomTooltip
        title={t('core:action.bookmark_video', {
          postProcess: 'capitalizeFirstChar',
        })}
        arrow
        placement={'top'}
      >
        <ButtonBase onClick={() => setIsOpen(true)}>
          <BookmarksIcon color={isInABookmark ? 'success' : 'info'} />
        </ButtonBase>
      </CustomTooltip>
      {isOpen && (
        <Box
          ref={ref}
          tabIndex={-1}
          //   onBlur={handleBlur}
          bgcolor={theme.palette.background.paper}
          sx={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            borderRadius: 2,
            p: 1,
            minWidth: 225,
            height: 300,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 501,
          }}
        >
          {mode === 1 && (
            <>
              <ButtonBase
                sx={{
                  padding: '5px 0px 10px 0px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                  width: '100%',
                }}
                onClick={() => {
                  setIsOpen(false);
                  setMode(1);
                  setTitle('');
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                  }}
                >
                  {t('core:bookmarks.bookmarks_lists', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>

                <CloseIcon
                  sx={{
                    fontSize: '1.15em',
                  }}
                />
              </ButtonBase>

              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  overflow: 'auto',
                  '::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },

                  '::-webkit-scrollbar': {
                    width: '16px',
                    height: '10px',
                  },

                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '8px',
                    backgroundClip: 'content-box',
                    border: '4px solid transparent',
                    transition: '0.3s background-color',
                  },

                  '::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {lists?.length === 0 && (
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '20px',
                    }}
                  >
                    {t('core:bookmarks.no_bookmarks_lists', {
                      postProcess: 'capitalizeFirstChar',
                    })}
                  </Typography>
                )}
                <Spacer height="10px" />
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  {lists?.map((list) => {
                    const isInList = isVideoInList(list.id, metadataReference);
                    return (
                      <ButtonBase
                        sx={{
                          width: '100%',
                          justifyContent: 'flex-start',
                        }}
                        key={list.id}
                        onClick={() =>
                          isInList
                            ? handleRemoveVideoFromList(
                                list.id,
                                metadataReference
                              )
                            : handleAddVideoToList(list.id, metadataReference)
                        }
                      >
                        <Checkbox checked={isInList} />
                        <Typography>{list?.title}</Typography>
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={() => setMode(2)}
                  variant="contained"
                  size="small"
                >
                  {t('core:bookmarks.new_list', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Button>
              </Box>
            </>
          )}
          {mode === 2 && (
            <>
              <Box
                sx={{
                  padding: '5px 0px 10px 0px',
                  display: 'flex',
                  gap: '10px',
                  width: '100%',
                }}
              >
                <ButtonBase
                  onClick={() => {
                    setIsOpen(false);
                    setMode(1);
                    setTitle('');
                  }}
                >
                  <ArrowBackIosIcon
                    sx={{
                      fontSize: '1.15em',
                    }}
                  />
                </ButtonBase>
                <ButtonBase>
                  <Typography
                    onClick={() => {
                      setIsOpen(false);
                      setMode(1);
                      setTitle('');
                    }}
                    sx={{
                      fontSize: '0.85rem',
                    }}
                  >
                    {t('core:bookmarks.bookmarks_lists', {
                      postProcess: 'capitalizeFirstChar',
                    })}
                  </Typography>
                </ButtonBase>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  overflow: 'auto',
                  '::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },

                  '::-webkit-scrollbar': {
                    width: '16px',
                    height: '10px',
                  },

                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '8px',
                    backgroundClip: 'content-box',
                    border: '4px solid transparent',
                    transition: '0.3s background-color',
                  },

                  '::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <TextField
                  inputRef={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  onClick={() => setMode(1)}
                  variant="contained"
                  size="small"
                >
                  {t('core:action.cancel', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Button>
                <Button
                  onClick={handleCreateList}
                  disabled={!title}
                  variant="contained"
                  size="small"
                >
                  {t('core:action.create', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
};
