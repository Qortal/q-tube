import {
  Box,
  Button,
  ButtonBase,
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
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [selectedList, setSelectedList, isHydratedSelectedList] =
    usePersistedState<number | any>('selectedBookmarkList', 0);
  const [bookmarks, setBookmarks, isHydratedBookmarks] = usePersistedState<
    Record<string, BookmarkList>
  >('bookmarks-v1', {});
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
    setBookmarks((prev) => {
      if (!prev[listId]) return prev; // List doesn't exist

      const { [listId]: _, ...rest } = prev; // Remove the key using object destructuring
      return rest;
    });
  };

  const handleEditListTitle = (listId: string, newTitle: string) => {
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
    lists.deleteList(`bookmarks-all-${selectedList?.id}`);
  };

  const deleteList = () => {
    lists.deleteList(`bookmarks-all-${selectedList?.id}`);
    setSelectedList(0);
    handleDeleteList(selectedList?.id);
    setIsOpenEdit(false);
  };

  console.log('sortedLists', sortedLists);

  if (!selectedList && isHydratedBookmarks) {
    return (
      <PageTransition>
        <Box
          sx={{
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: isSmall ? 'center' : 'flex-start',
          }}
        >
          <FormControl
            sx={{
              maxWidth: '100%',
              width: '320px',
            }}
          >
            <InputLabel id="bookmark-list-label">
              {t('core:bookmarks.select_list', {
                postProcess: 'capitalizeFirstChar',
              })}
            </InputLabel>

            <Select
              labelId="bookmark-list-label"
              value={selectedList?.id || 0}
              label={t('core:bookmarks.select_list', {
                postProcess: 'capitalizeFirstChar',
              })}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value={0}>
                <em>
                  {t('core:publish.all_videos', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </em>
              </MenuItem>
              {sortedLists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Spacer height="20px" />

          <Box
            sx={{
              width: '100%',
              flexDirection: 'column',
              display: 'flex',
              alignItems: isSmall ? 'center' : 'flex-start',
            }}
          >
            <PageSubTitle>
              {t('core:bookmarks.all_bookmarks', {
                postProcess: 'capitalizeFirstChar',
              })}
            </PageSubTitle>
            <Spacer height="14px" />
            <Divider flexItem />
            <Spacer height="20px" />
          </Box>

          <Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <VideoListPreloaded
                listName="bookmarks-all"
                videoList={allVideos}
                disableActions
              />
            </Box>
          </Box>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <FormControl fullWidth>
        <InputLabel id="bookmark-list-label">
          {t('core:bookmarks.select_list', {
            postProcess: 'capitalizeFirstChar',
          })}
        </InputLabel>

        <Select
          labelId="bookmark-list-label"
          value={selectedList?.id || 0}
          label={t('core:bookmarks.select_list', {
            postProcess: 'capitalizeFirstChar',
          })}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value={0}>
            <em>
              {t('core:publish.all_videos', {
                postProcess: 'capitalizeFirstChar',
              })}
            </em>
          </MenuItem>
          {sortedLists.map((list) => (
            <MenuItem key={list.id} value={list.id}>
              {list.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Spacer height="20px" />

      <Box
        sx={{
          width: '100%',
        }}
      >
        <PageSubTitle
          sx={{
            alignSelf: 'flex-start',
          }}
        >
          {t('core:bookmarks.bookmark_list', {
            postProcess: 'capitalizeFirstChar',
          })}
          : {selectedList?.title}
        </PageSubTitle>
        <ButtonBase>
          <EditIcon onClick={() => setIsOpenEdit(true)} />
        </ButtonBase>
        <Spacer height="14px" />
        <Divider flexItem />
        <Spacer height="20px" />
      </Box>
      <Box>
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
            sx={{
              marginRight: 'auto',
            }}
          >
            {t('core:action.delete', {
              postProcess: 'capitalizeFirstChar',
            })}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsOpenEdit(false);
              setNewTitle(selectedList?.title);
            }}
          >
            {t('core:action.close', {
              postProcess: 'capitalizeFirstChar',
            })}
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
            {t('core:action.save', {
              postProcess: 'capitalizeFirstChar',
            })}
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
};
