import React, { useEffect, useRef, useState } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  TextField,
  Typography,
  useTheme,
  Checkbox,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { usePersistedState } from '../../../state/persist/persist';
import ShortUniqueId from 'short-unique-id';
import { Service, useGlobal } from 'qapp-core';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from './CustomTooltip';
import { BookmarkList } from '../../../types/bookmark';
import FolderIcon from '@mui/icons-material/Folder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
const uid = new ShortUniqueId({ length: 15, dictionary: 'alphanum' });
const MAX_NESTING_LEVEL = 1;

export const AddToBookmarks = ({ metadataReference, type = 'video' }) => {
  const { t } = useTranslation(['core']);
  const { lists: globalLists } = useGlobal();
  const [bookmarks, setBookmarks, isHydratedBookmarks] = usePersistedState<
    Record<string, BookmarkList>
  >('bookmarks-v1', {});
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(1); // 1: main, 2: new list, 3: new folder
  const [title, setTitle] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (isOpen) ref?.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (mode === 2 || mode === 3) inputRef.current?.focus();
  }, [mode]);

  const handleCreateList = (parentId?: string) => {
    if (!isHydratedBookmarks) return;
    const newId = uid.rnd();
    setBookmarks((prev) => {
      const updated: Record<string, BookmarkList> = {
        ...prev,
        [newId]: {
          id: newId,
          title,
          description: '',
          created: Date.now(),
          updated: Date.now(),
          lastAdded: 0,
          videos: [],
          lastAccessed: 0,
          type: 'list',
        },
      };
      if (parentId && prev[parentId]?.type === 'folder') {
        updated[parentId] = {
          ...prev[parentId],
          children: [...(prev[parentId].children || []), newId],
          updated: Date.now(),
        };
      }
      return updated;
    });
    setMode(1);
    setTitle('');
    setParentId(null);
  };

  const handleCreateFolder = () => {
    if (!isHydratedBookmarks) return;
    const newId = uid.rnd();
    setBookmarks((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        title,
        description: '',
        created: Date.now(),
        updated: Date.now(),
        lastAdded: 0,
        videos: [],
        lastAccessed: 0,
        type: 'folder',
        children: [],
      },
    }));
    setMode(1);
    setTitle('');
  };

  const handleAddVideoToList = (listId: string, video: any) => {
    if (!isHydratedBookmarks) return;
    globalLists.deleteList('bookmarks-all');
    globalLists.deleteList(`bookmarks-all-${listId}`);
    setBookmarks((prev) => {
      const list = prev[listId];
      if (!list || list.type !== 'list') return prev;
      if (
        list.videos.some(
          (v) =>
            v.name === video.name &&
            v.identifier === video.identifier &&
            v.service === video.service
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        [listId]: {
          ...list,
          videos: [
            ...list.videos,
            {
              ...video,
              addedAt: Date.now(),
              created: video?.created || Date.now(),
              size: 200,
              type,
            },
          ],
          updated: Date.now(),
        },
      };
    });
  };

  const handleRemoveVideoFromList = (listId: string, video: any) => {
    if (!isHydratedBookmarks) return;
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

  const isVideoInList = (listId: string, video: any): boolean => {
    const list = bookmarks[listId];
    return (
      list?.type === 'list' &&
      list.videos.some(
        (v) =>
          v.name === video.name &&
          v.identifier === video.identifier &&
          v.service === video.service
      )
    );
  };

  const isVideoInAnyList = (video: any): boolean => {
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

  const buildBookmarkTree = (
    bookmarks: Record<string, BookmarkList>
  ): BookmarkList[] => {
    const roots: BookmarkList[] = [];
    const childSet = new Set(
      Object.values(bookmarks).flatMap((b) => b.children ?? [])
    );
    Object.values(bookmarks).forEach((item) => {
      if (
        !childSet.has(item.id) &&
        (item.type === 'list' || item.type === 'folder')
      ) {
        roots.push(item);
      }
    });
    return roots.sort((a, b) => a.title.localeCompare(b.title));
  };

  const renderBookmarkNode = (
    node: BookmarkList,
    depth = 0
  ): React.ReactNode => {
    if (node.type === 'folder') {
      return (
        <Box key={node.id} sx={{ ml: depth + 1, mt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <FolderIcon />
            <Typography sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
              {node.title}
            </Typography>
            {depth < MAX_NESTING_LEVEL && (
              <Button
                startIcon={<PlaylistAddIcon />}
                size="small"
                onClick={() => {
                  setMode(2);
                  setParentId(node.id);
                }}
                sx={{
                  marginLeft: 'auto',
                }}
              >
                {t('core:bookmarks.new_list')}
              </Button>
            )}
          </Box>
          {depth < MAX_NESTING_LEVEL &&
            (node.children || []).map((childId) => {
              const child = bookmarks[childId];
              return child ? renderBookmarkNode(child, depth + 1) : null;
            })}
        </Box>
      );
    }

    const isInList = isVideoInList(node.id, metadataReference);
    return (
      <ButtonBase
        key={node.id}
        onClick={() =>
          isInList
            ? handleRemoveVideoFromList(node.id, metadataReference)
            : handleAddVideoToList(node.id, metadataReference)
        }
        sx={{ pl: depth * 2, justifyContent: 'flex-start', width: '100%' }}
      >
        <Checkbox checked={isInList} />
        <Typography
          sx={{
            wordBreak: 'break-word',
          }}
        >
          {node.title}
        </Typography>
      </ButtonBase>
    );
  };

  return (
    <>
      <CustomTooltip
        title={t(
          type === 'playlist'
            ? 'core:action.bookmark_playlist'
            : 'core:action.bookmark_video',
          {
            postProcess: 'capitalizeFirstChar',
          }
        )}
        arrow
        placement="top"
      >
        <ButtonBase
          onClick={() => setIsOpen(true)}
          sx={{
            alignSelf: 'flex-start',
            marginBottom: '5px',
          }}
        >
          <BookmarksIcon
            color={isVideoInAnyList(metadataReference) ? 'success' : 'info'}
          />
        </ButtonBase>
      </CustomTooltip>
      {isOpen && (
        <Box
          ref={ref}
          tabIndex={-1}
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
                onClick={() => {
                  setIsOpen(false);
                  setMode(1);
                  setTitle('');
                }}
                sx={{
                  p: '5px 0 10px',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography sx={{ fontSize: '0.85rem' }}>
                  {t('core:bookmarks.bookmark_lists', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>
                <CloseIcon sx={{ fontSize: '1.15em' }} />
              </ButtonBase>
              <Divider />
              <Box
                sx={{
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
                    backgroundColor: 'rgba(63, 67, 80, 0.24)',
                    borderRadius: '8px',
                    backgroundClip: 'content-box',
                    border: '4px solid transparent',
                    transition: '0.3s background-color',
                  },
                  '::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: 'rgba(63, 67, 80, 0.50)',
                  },
                }}
              >
                {buildBookmarkTree(bookmarks).length === 0 ? (
                  <Typography
                    sx={{ fontSize: '1rem', textAlign: 'center', mt: 2 }}
                  >
                    {t('core:bookmarks.no_bookmarks_lists', {
                      postProcess: 'capitalizeFirstChar',
                    })}
                  </Typography>
                ) : (
                  buildBookmarkTree(bookmarks).map((node) =>
                    renderBookmarkNode(node, 0)
                  )
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <Button
                  onClick={() => setMode(2)}
                  size="small"
                  variant="contained"
                >
                  {t('core:bookmarks.new_list')}
                </Button>
                <Button
                  onClick={() => setMode(3)}
                  size="small"
                  variant="contained"
                >
                  {t('core:bookmarks.new_folder')}
                </Button>
              </Box>
            </>
          )}

          {(mode === 2 || mode === 3) && (
            <>
              <Box sx={{ display: 'flex', gap: '10px', width: '100%', py: 1 }}>
                <ButtonBase
                  onClick={() => {
                    setMode(1);
                    setTitle('');
                    setParentId(null);
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: '1.15em' }} />
                </ButtonBase>
                <Typography sx={{ fontSize: '0.85rem' }}>
                  {t('core:bookmarks.bookmark_lists', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
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
                    backgroundColor: 'rgba(63, 67, 80, 0.24)',
                    borderRadius: '8px',
                    backgroundClip: 'content-box',
                    border: '4px solid transparent',
                    transition: '0.3s background-color',
                  },
                  '::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: 'rgba(63, 67, 80, 0.50)',
                  },
                }}
              >
                <TextField
                  inputRef={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && title.trim()) {
                      mode === 2
                        ? handleCreateList(parentId ?? undefined)
                        : handleCreateFolder();
                    }
                  }}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => setMode(1)}
                  variant="contained"
                  size="small"
                >
                  {t('core:action.cancel')}
                </Button>
                <Button
                  onClick={() =>
                    mode === 2
                      ? handleCreateList(parentId ?? undefined)
                      : handleCreateFolder()
                  }
                  disabled={!title}
                  variant="contained"
                  size="small"
                >
                  {t('core:action.create')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
};
