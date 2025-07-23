import { useState } from 'react';
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
import { Spacer, useAuth } from 'qapp-core';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { useTranslation } from 'react-i18next';
export const PlaylistListEdit = ({
  playlistData,
  updateVideoList,
  removeVideo,
  addVideo,
}) => {
  const { t } = useTranslation(['core']);

  const theme = useTheme();
  const isSmall = useIsSmall();
  const { name: username } = useAuth();

  const [searchResults, setSearchResults] = useState([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [userSearch, setUserSearch] = useState(
    `name=${username}&exactmatchnames=true&`
  );

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
  };

  return (
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
                  {vid?.metadata?.title}
                </Typography>
                <DeleteOutlineIcon
                  onClick={() => {
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
              gap: '10px',
            }}
          >
            <Input
              id="standard-adornment-name"
              onChange={(e) => {
                setFilterSearch(e.target.value);
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
              }}
            />
          </Box>
          <Box>
            <Spacer height="20px" />
            <Button
              onClick={() => {
                search();
              }}
              variant="contained"
            >
              {t('core:navbar.search', {
                postProcess: 'capitalizeFirstChar',
              })}
            </Button>
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
                    addVideo(vid);
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
    </Box>
  );
};
