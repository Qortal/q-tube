import { useState, useEffect } from 'react';
import { CardContentContainerComment } from '../../common/Comments/Comments-styles.tsx';
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from '../PublishVideo/PublishVideo-styles.tsx';
import {
  Box,
  Button,
  Input,
  RadioGroup,
  Radio,
  IconButton,
  Typography,
  useTheme,
  FormControlLabel,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { QTUBE_VIDEO_BASE } from '../../../constants/Identifiers.ts';
import { QortalMetadata, Spacer, useAuth, showError } from 'qapp-core';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { useTranslation } from 'react-i18next';
import { BoundedNumericTextField } from '../../../utils/BoundedNumericTextField.tsx';
export const PlaylistListEdit = ({
  playlistData,
  updateVideoList,
  removeVideo,
  addVideo,
  onCharacterRemovalError,
}) => {
  const { t } = useTranslation(['core']);

  const theme = useTheme();
  const isSmall = useIsSmall();
  const { name: username } = useAuth();

  const [searchResults, setSearchResults] = useState<QortalMetadata[]>([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [userSearch, setUserSearch] = useState(
    `name=${username}&exactmatchnames=true&`
  );

  // State for character removal functionality
  const [removeFromStart, setRemoveFromStart] = useState(0);
  const [removeFromEnd, setRemoveFromEnd] = useState(0);
  const [characterRemovalError, setCharacterRemovalError] = useState(false);
  const [tempTitlesList, setTempTitlesList] = useState<string[]>([]);

  const videos = playlistData?.videos || [];
  //const [hoveredIndex, setHoveredIndex] = useState(null);  // Mayb in the future

  const handleRadioChange = (event) => {
    const value = event.target.value;
    if (value === 'myVideos') {
      setUserSearch(`name=${username}&exactmatchnames=true&`);
    } else {
      setUserSearch(''); // All videos
    }
  };

  const search = async () => {
    const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&mode=ALL&identifier=${QTUBE_VIDEO_BASE}&title=${filterSearch}&limit=20&includemetadata=true&reverse=true&${userSearch}offset=0`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseDataSearchVid = await response.json();
    setSearchResults(responseDataSearchVid);
  };

  // Function to move a video up or down in the playlist
  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const updated = [...videos];
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];
    updateVideoList(updated);
    
    // Also reorder tempTitlesList to maintain synchronization
    const updatedTitles = [...tempTitlesList];
    [updatedTitles[index], updatedTitles[targetIndex]] = [
      updatedTitles[targetIndex],
      updatedTitles[index],
    ];
    setTempTitlesList(updatedTitles);
  };

  // Helper function to check if a video is already in the playlist
  const isVideoInPlaylist = (video) => {
    return videos.some((vid) => vid.identifier === video.identifier);
  };

  // Function to refresh titles from QDN resources
  const refreshTitles = async () => {
    if (!playlistData?.videos || playlistData.videos.length === 0) return;

    try {
      const fetchPromises = playlistData.videos.map(async (video) => {
        const response = await qortalRequest({
          action: 'FETCH_QDN_RESOURCE',
          name: video.name,
          service: video.service,
          identifier: video.identifier,
        });
        // Preserve all existing metadata fields except title
        return {
          ...video,
          metadata: {
            ...video.metadata,
            title: response.title || video.metadata?.title || '',
          },
        };
      });

      const updatedVideos = await Promise.all(fetchPromises);
      // Extract titles and save to tempTitlesList
      const titles = updatedVideos.map((video) => video?.metadata?.title || '');
      setTempTitlesList(titles);
      updateVideoList(updatedVideos);
    } catch (error) {
      console.error('Error refreshing titles:', error);
    }
  };

  // Function to apply character removal
  const applyCharacterRemoval = (startChars: number, endChars: number) => {
    if (!playlistData?.videos || playlistData.videos.length === 0) return;

    let hasError = false;
    const updatedVideos = playlistData.videos.map((video, index) => {
      // Always use titles from tempTitlesList as the source
      const title = tempTitlesList[index] || '';
      const titleLength = title.length;

      // Check if removal would exceed title length
      if (startChars + endChars > titleLength) {
        hasError = true;
        return video;
      }

      // Apply character removal
      const newTitle = title.substring(startChars, titleLength - endChars);
      return {
        ...video,
        playlistTitle: newTitle, // Only update playlistTitle field
      };
    });

    setCharacterRemovalError(hasError);
    if (hasError) {
      showError('Too Many Characters Removed from a Title');
    } else {
      updateVideoList(updatedVideos);
    }
  };

  // Notify parent component when character removal error state changes
  useEffect(() => {
    if (onCharacterRemovalError) {
      onCharacterRemovalError(characterRemovalError);
    }
  }, [characterRemovalError, onCharacterRemovalError]);

  // Trigger search when userSearch changes (e.g., when radio buttons are changed)
  useEffect(() => {
    search();
  }, [userSearch]);

  // Initialize tempTitlesList when playlistData changes
  useEffect(() => {
    if (playlistData?.videos) {
      // Only update tempTitlesList if it's empty
      if (tempTitlesList.length === 0) {
        // Check if videos have playlistTitle field (from edited playlists)
        const hasPlaylistTitle = playlistData.videos.some(
          (video) => video.playlistTitle
        );

        if (hasPlaylistTitle) {
          // Use playlistTitle if available
          setTempTitlesList(
            playlistData.videos.map(
              (video) => video.playlistTitle || video?.metadata?.title || ''
            )
          );
        } else {
          // Use metadata title as fallback
          setTempTitlesList(
            playlistData.videos.map((video) => video?.metadata?.title || '')
          );
        }
      } else if (playlistData.videos.length > tempTitlesList.length) {
        // New videos were added, append only the new titles
        const newVideos = playlistData.videos.slice(tempTitlesList.length);
        const newTitles = newVideos.map(
          (video) => video.playlistTitle || video?.metadata?.title || ''
        );
        setTempTitlesList([...tempTitlesList, ...newTitles]);
      }
    }
  }, [playlistData?.videos?.length]); // Only update when the number of videos changes

  useEffect(() => {
    // removes title characters after titles are refreshed
    applyCharacterRemoval(removeFromStart, removeFromEnd);
  }, [tempTitlesList]);

  return (
    <>
      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Button
          variant="contained"
          onClick={refreshTitles}
          sx={{ marginBottom: '10px', color: 'white' }}
        >
          {t('core:publish.refresh_titles', {
            postProcess: 'capitalizeFirstChar',
          })}
        </Button>

        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          <BoundedNumericTextField
            label={t('core:publish.remove_from_start', {
              postProcess: 'capitalizeFirstChar',
            })}
            minValue={0}
            maxValue={100}
            allowDecimals={false}
            allowNegatives={false}
            value={removeFromStart}
            afterChange={(value) => {
              const numValue = parseInt(value) || 0;
              setRemoveFromStart(numValue);
              applyCharacterRemoval(numValue, removeFromEnd);
            }}
          />

          <BoundedNumericTextField
            label={t('core:publish.remove_from_end', {
              postProcess: 'capitalizeFirstChar',
            })}
            minValue={0}
            maxValue={100}
            allowDecimals={false}
            allowNegatives={false}
            value={removeFromEnd}
            afterChange={(value) => {
              const numValue = parseInt(value) || 0;
              setRemoveFromEnd(numValue);
              applyCharacterRemoval(removeFromStart, numValue);
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          gap: '10px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 50%',
            outline: `1px ${theme.palette.action.active} solid`,
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <CrowdfundSubTitleRow>
            <CrowdfundSubTitle>
              {t('core:publish.playlist', {
                postProcess: 'capitalizeFirstChar',
              })}
            </CrowdfundSubTitle>
          </CrowdfundSubTitleRow>
          <CardContentContainerComment
            sx={{
              marginTop: '25px',
              maxHeight: '450px',
              overflow: 'auto',
            }}
          >
            {videos.map((vid, index) => {
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
                    '&:hover .action-icons': { display: 'flex' },
                  }}
                  // onMouseEnter={() => setHoveredIndex(index)}
                  // onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      sx={{ padding: '2px' }}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === playlistData?.videos?.length - 1}
                      sx={{ padding: '2px' }}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
                    {vid?.playlistTitle || vid?.metadata?.title}
                  </Typography>
                  <DeleteOutlineIcon
                    onClick={() => {
                      // Remove from tempTitlesList as well
                      const updatedTitles = [...tempTitlesList];
                      updatedTitles.splice(index, 1);
                      setTempTitlesList(updatedTitles);
                      
                      // Then remove the video
                      removeVideo(index);
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 50%',
            outline: `1px ${theme.palette.action.active} solid`,
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <CrowdfundSubTitleRow>
            <CrowdfundSubTitle>
              {t('core:publish.add_videos_playlist', {
                postProcess: 'capitalizeFirstChar',
              })}
            </CrowdfundSubTitle>
          </CrowdfundSubTitleRow>
          <CardContentContainerComment
            sx={{
              marginTop: '25px',
              maxHeight: '450px',
              overflow: 'auto',
            }}
          >
            <Box>
              <RadioGroup
                row
                defaultValue="myVideos"
                name="radio-buttons-group-video-select"
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="myVideos"
                  control={<Radio />}
                  label={t('core:publish.my_videos', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                  componentsProps={{
                    typography: { sx: { fontSize: '14px' } },
                  }}
                />
                <FormControlLabel
                  value="allVideos"
                  control={<Radio />}
                  label={t('core:publish.all_videos', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                  componentsProps={{
                    typography: { sx: { fontSize: '14px' } },
                  }}
                />
              </RadioGroup>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginLeft: '10px',
                marginRight: '10px',
              }}
            >
              <Input
                id="standard-adornment-name"
                onChange={(e) => {
                  setFilterSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    search();
                  }
                }}
                value={filterSearch}
                placeholder={t('core:publish.search_by_title', {
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
                  flex: 1,
                }}
              />
              <Button
                onClick={() => {
                  search();
                }}
                variant="contained"
                sx={{ color: 'white' }}
              >
                {t('core:navbar.search', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Button>
            </Box>
            <Box>
              <Spacer height="20px" />
            </Box>

            {searchResults?.map((vid, index) => {
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
                      if (!isVideoInPlaylist(vid)) {
                        addVideo(vid);
                      }
                    }}
                    sx={{
                      cursor: isVideoInPlaylist(vid)
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: isVideoInPlaylist(vid) ? 0.5 : 1,
                      color: isVideoInPlaylist(vid) ? 'grey' : 'inherit',
                    }}
                  />
                </Box>
              );
            })}
          </CardContentContainerComment>
        </Box>
      </Box>
    </>
  );
};
