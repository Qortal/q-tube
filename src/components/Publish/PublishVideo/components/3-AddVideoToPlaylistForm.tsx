import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Input, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardContentContainerComment } from '../../../common/Comments/Comments-styles.tsx';
import ImageUploader from '../../../common/ImageUploader.tsx';
import { TextEditor } from '../../../common/TextEditor/TextEditor.tsx';
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from '../../PublishAndEditPlaylist/Upload-styles.tsx';
import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CustomInputField,
  FormActionButton,
  LogoPreviewRow,
  TimesIcon,
} from '../PublishVideo-styles.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';
import { CategorySelect } from './CategorySelect.tsx';

export const AddVideoToPlaylistForm: React.FC = () => {
  const { t } = useTranslation(['core']);
  const theme = useTheme();
  const workflow = usePublishVideo();

  const {
    playlistSetting,
    setPlaylistSetting,
    playlistTitle,
    setPlaylistTitle,
    playlistDescription,
    setPlaylistDescription,
    playlistCoverImage,
    setPlaylistCoverImage,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectExistingPlaylist,
    setSelectExistingPlaylist,
    searchResults,
    filterSearch,
    setFilterSearch,
    search,
  } = workflow;

  return (
    <>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Typography>
          {t('core:publish.playlist', {
            postProcess: 'capitalizeFirstChar',
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            marginTop: '20px',
          }}
        >
          {t('core:publish.add_vids_playlist', {
            postProcess: 'capitalizeFirstChar',
          })}
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
          }}
        >
          {t('core:publish.add_vids_playlist_optional', {
            postProcess: 'capitalizeFirstChar',
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          gap: '20px',
        }}
      >
        <FormActionButton
          variant="contained"
          color={!playlistSetting ? 'success' : 'primary'}
          onClick={() => {
            setPlaylistSetting(null);
          }}
        >
          {t('core:publish.no_playlist', {
            postProcess: 'capitalizeFirstChar',
          })}
        </FormActionButton>
        <FormActionButton
          color={playlistSetting === 'new' ? 'success' : 'primary'}
          variant="contained"
          onClick={() => {
            setPlaylistSetting('new');
          }}
        >
          {t('core:publish.new_playlist', {
            postProcess: 'capitalizeFirstChar',
          })}
        </FormActionButton>
        <FormActionButton
          color={playlistSetting === 'existing' ? 'success' : 'primary'}
          variant="contained"
          onClick={() => {
            setPlaylistSetting('existing');
          }}
        >
          {t('core:publish.existing_playlist', {
            postProcess: 'capitalizeFirstChar',
          })}
        </FormActionButton>
      </Box>
      {playlistSetting === 'existing' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <CrowdfundSubTitleRow>
            <CrowdfundSubTitle>
              {t('core:publish.select_existing_playlist', {
                postProcess: 'capitalizeFirstChar',
              })}
            </CrowdfundSubTitle>
          </CrowdfundSubTitleRow>
          <Typography>{selectExistingPlaylist?.metadata?.title}</Typography>
          <CardContentContainerComment
            sx={{
              marginTop: '25px',
              height: '450px',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
              }}
            >
              <Input
                id="standard-adornment-name"
                onChange={(e) => {
                  setFilterSearch(e.target.value);
                }}
                value={filterSearch}
                placeholder={t('core:publish.playlist_search_by_title', {
                  postProcess: 'capitalizeFirstChar',
                })}
                sx={{
                  borderBottom: '1px solid white',
                  '&&:before': {
                    borderBottom: 'none',
                  },
                  '&&:after': {
                    borderBottom: 'none',
                  },
                  '&&:hover:before': {
                    borderBottom: 'none',
                  },
                  '&&.Mui-focused:before': {
                    borderBottom: 'none',
                  },
                  '&&.Mui-focused': {
                    outline: 'none',
                  },
                  fontSize: '18px',
                }}
              />
              <Button
                onClick={() => {
                  search();
                }}
                sx={{ color: 'white' }}
                variant="contained"
              >
                {t('core:navbar.search', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Button>
            </Box>

            {searchResults?.map((vid: any, index) => {
              return (
                <Box
                  key={vid?.identifier}
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    width: '100%',
                    alignItems: 'center',
                    padding: '10px',
                    borderRadius: '5px',
                    userSelect: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {vid?.metadata?.title}
                  </Typography>
                  <AddIcon
                    onClick={() => {
                      setSelectExistingPlaylist(vid);
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              );
            })}
          </CardContentContainerComment>
        </Box>
      )}
      {playlistSetting === 'new' && (
        <>
          {!playlistCoverImage ? (
            <ImageUploader onPick={(img: string) => setPlaylistCoverImage(img)}>
              <AddCoverImageButton variant="contained">
                {t('core:publish.add_cover_image', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
                <AddLogoIcon
                  sx={{
                    height: '25px',
                    width: 'auto',
                  }}
                />
              </AddCoverImageButton>
            </ImageUploader>
          ) : (
            <LogoPreviewRow>
              <CoverImagePreview src={playlistCoverImage} alt="logo" />
              <TimesIcon
                color={theme.palette.text.primary}
                onClickFunc={() => setPlaylistCoverImage(null)}
                height={'32'}
                width={'32'}
              />
            </LogoPreviewRow>
          )}
          <CategorySelect
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
          <CustomInputField
            name="title"
            label={t('core:publish.title_playlist', {
              postProcess: 'capitalizeFirstChar',
            })}
            variant="filled"
            value={playlistTitle}
            onChange={(e) => {
              const value = e.target.value;
              let formattedValue: string = value;

              formattedValue = value.replace(/[^a-zA-Z0-9\s-]/g, '');

              setPlaylistTitle(formattedValue);
            }}
            inputProps={{ maxLength: 180 }}
            required
          />

          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            {t('core:publish.description_playlist', {
              postProcess: 'capitalizeFirstChar',
            })}
          </Typography>
          <TextEditor
            inlineContent={playlistDescription}
            setInlineContent={(value: string) => {
              setPlaylistDescription(value);
            }}
          />
        </>
      )}
    </>
  );
};
