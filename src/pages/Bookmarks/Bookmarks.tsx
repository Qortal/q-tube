import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import { useEffect, useMemo, useRef, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Spacer, useGlobal } from 'qapp-core';

import { VideoListPreloaded } from '../Home/Components/VideoListPreloaded.tsx';
import { usePersistedState } from '../../state/persist/persist.ts';
import { PageSubTitle } from '../../components/common/General/GeneralStyles.tsx';
import EditIcon from '@mui/icons-material/Edit';
import { PageTransition } from '../../components/common/PageTransition.tsx';
import { useIsSmall } from '../../hooks/useIsSmall.tsx';
import { useTranslation } from 'react-i18next';
import { BookmarkList } from '../../types/bookmark.ts';

export const Bookmarks = () => {
  const { t } = useTranslation(['core']);
  const isSmall = useIsSmall();
  const [selectedList, setSelectedList] = usePersistedState<any>(
    'selectedBookmarkList',
    0
  );
  const [bookmarks, setBookmarks, isHydratedBookmarks] = usePersistedState<
    Record<string, BookmarkList>
  >('bookmarks-v1', {});
  const [folderView, setFolderView] = useState<string | null>(null);
  const inputRef = useRef(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { lists } = useGlobal();

  const allVideos = useMemo(() => {
    if (selectedList) {
      if (bookmarks[selectedList?.id]) {
        return bookmarks[selectedList?.id].videos.sort(
          (a, b) => b.addedAt - a.addedAt
        );
      }
      return [];
    }
    return Object.values(bookmarks)
      .filter((b) => b.type === 'list')
      .flatMap((b) => b.videos)
      .sort((a, b) => b.addedAt - a.addedAt);
  }, [bookmarks, selectedList?.id]);

  const sortedLists = useMemo(() => {
    return Object.values(bookmarks)
      .filter((b) => b.type === 'list' && !!b.title)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [bookmarks]);

  const rootLists = useMemo(() => {
    const childIds = new Set(
      Object.values(bookmarks).flatMap((b) => b.children ?? [])
    );
    return Object.values(bookmarks).filter(
      (b) => (b.type === 'list' || b.type === 'folder') && !childIds.has(b.id)
    );
  }, [bookmarks]);

  const currentLists = useMemo(() => {
    if (!folderView) return rootLists;
    const folder = bookmarks[folderView];
    if (!folder || folder.type !== 'folder') return [];
    return (folder.children || []).map((id) => bookmarks[id]).filter(Boolean);
  }, [folderView, bookmarks, rootLists]);

  const handleChange = (event) => {
    const listId = event.target.value;
    if (!listId) {
      setSelectedList(0);
      return;
    }
    const selectedList = bookmarks[listId];
    if (selectedList) setSelectedList(selectedList);
  };

  useEffect(() => {
    if (selectedList) {
      setNewTitle(selectedList?.title);
    }
  }, [selectedList]);

  const handleDeleteList = (listId: string) => {
    if (!isHydratedBookmarks) return;
    setBookmarks((prev) => {
      if (!prev[listId]) return prev;
      const { [listId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleEditListTitle = (listId: string, newTitle: string) => {
    if (!isHydratedBookmarks) return;
    setBookmarks((prev) => {
      const list = prev[listId];
      if (!list || list.type !== 'list') return prev;
      return {
        ...prev,
        [listId]: {
          ...list,
          title: newTitle,
          updated: Date.now(),
        },
      };
    });
    setNewTitle('');
    setIsOpenEdit(false);
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter' && newTitle?.trim()) {
      handleEditListTitle(selectedList?.id, newTitle);
    }
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
    lists.deleteList(`bookmarks-all-${selectedList?.id}`);
  };

  const deleteList = () => {
    lists.deleteList(`bookmarks-all-${selectedList?.id}`);
    setSelectedList(0);
    handleDeleteList(selectedList?.id);
    setIsOpenEdit(false);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (!isHydratedBookmarks) return;
    if (!bookmarks[folderId] || bookmarks[folderId].type !== 'folder') return;

    const folder = bookmarks[folderId];
    const children = folder.children || [];

    setBookmarks((prev) => {
      const updated = { ...prev };
      delete updated[folderId];
      children.forEach((childId) => {
        delete updated[childId];
      });
      return updated;
    });

    setFolderView(null);
  };

  if (!selectedList) {
    return (
      <PageTransition>
        <Box
          sx={{
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: '95%',
            }}
          >
            <PageSubTitle
              sx={{
                alignSelf: 'flex-start',
              }}
            >
              {t('core:sidenav.bookmarks', {
                postProcess: 'capitalizeFirstChar',
              })}
            </PageSubTitle>
            <Spacer height="14px" />
            <Divider flexItem />
            <Spacer height="20px" />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{
              width: '100%',
            }}
          >
            {(folderView !== null || selectedList !== 0) && (
              <Button
                onClick={() => {
                  setFolderView(null);
                  setSelectedList(0);
                }}
                size="small"
              >
                ←{' '}
                {t('core:action.back', { postProcess: 'capitalizeFirstChar' })}
              </Button>
            )}

            {folderView && (
              <Button
                color="error"
                size="small"
                onClick={() => {
                  handleDeleteFolder(folderView);
                }}
              >
                {t('core:bookmarks.delete_folder', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Button>
            )}
          </Box>

          {currentLists?.length === 0 && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Typography>
                {' '}
                {t('core:bookmarks.no_bookmarks_lists', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 2,
              width: '100%',
              paddingTop: '20px',
            }}
          >
            {currentLists.map((item) => (
              <Card
                key={item.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  if (item.type === 'folder') setFolderView(item.id);
                  else setSelectedList(item);
                }}
              >
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {item.type === 'folder' ? <FolderIcon /> : <ListIcon />}
                  <Typography>{item?.title}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Button
        startIcon={<ArrowBackIosIcon />}
        onClick={() => {
          setSelectedList(0);
          setFolderView(null);
        }}
        size="small"
      >
        {t('core:action.back', { postProcess: 'capitalizeFirstChar' })}
      </Button>
      <Spacer height="10px" />

      <PageSubTitle>
        {t('core:bookmarks.bookmark_list', {
          postProcess: 'capitalizeFirstChar',
        })}
        : {selectedList?.title}
      </PageSubTitle>

      <Spacer height="10px" />

      <Button
        size="small"
        onClick={() => setIsOpenEdit(true)}
        variant="outlined"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>

      <Spacer height="10px" />
      <Divider flexItem />
      <Spacer height="20px" />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <VideoListPreloaded
          listName={`bookmarks-all-${selectedList?.id}`}
          videoList={allVideos}
          handleRemoveVideoFromList={handleRemoveVideoFromList}
          listId={selectedList?.id}
        />
      </Box>

      <Dialog
        open={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '300px',
              maxWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TextField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              inputRef={inputRef}
              onKeyDown={handleInputKeyDown}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={deleteList}
            sx={{ marginRight: 'auto' }}
          >
            {t('core:action.delete', { postProcess: 'capitalizeFirstChar' })}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsOpenEdit(false);
              setNewTitle(selectedList?.title);
            }}
          >
            {t('core:action.close', { postProcess: 'capitalizeFirstChar' })}
          </Button>
          <Button
            disabled={!newTitle.trim() || selectedList?.title === newTitle}
            variant="contained"
            onClick={() => {
              handleEditListTitle(selectedList?.id, newTitle);
              setSelectedList((prev) => {
                return {
                  ...prev,
                  title: newTitle,
                };
              });
              setIsOpenEdit(false);
            }}
          >
            {t('core:action.save', { postProcess: 'capitalizeFirstChar' })}
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
};
