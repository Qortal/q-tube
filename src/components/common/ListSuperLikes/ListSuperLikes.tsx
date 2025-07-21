import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { fontSizeSmall } from '../../../constants/Misc.ts';
import { formatDate } from '../../../utils/time.ts';
import { useAtomValue } from 'jotai';
import { hashMapSuperlikesAtom } from '../../../state/global/superlikes.ts';
import { Spacer } from 'qapp-core';

const truncateMessage = (message) => {
  return message.length > 40 ? message.slice(0, 40) + '...' : message;
};

export default function ListSuperLikes({ superlikes }) {
  const hashMapSuperlikes = useAtomValue(hashMapSuperlikesAtom);
  const theme = useTheme();
  const navigate = useNavigate();

  console.log('superlikes', superlikes);
  return (
    <List
      sx={{
        maxWidth: '100%',
        width: 300,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        overflowY: 'scroll',
        '::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },

        '::-webkit-scrollbar': {
          width: '16px',
          height: '10px',
          background: 'none',
        },

        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'gold',
          borderRadius: '8px',
          backgroundClip: 'content-box',
          border: '4px solid transparent',
          transition: '0.3s background-color',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(255,215,0, 0.5)',
        },
      }}
    >
      {superlikes?.map((superlike, index) => {
        //  let hasHash = false
        let message = '';
        let url = '';
        let forName = '';
        //  let hash = {}
        if (hashMapSuperlikes[superlike?.identifier]) {
          message = hashMapSuperlikes[superlike?.identifier]?.comment || '';
          if (
            hashMapSuperlikes[superlike?.identifier]?.notificationInformation
          ) {
            const info =
              hashMapSuperlikes[superlike?.identifier]?.notificationInformation;
            forName = info?.name;
            url = `/video/${info?.name}/${info?.identifier}`;
          }

          //  hasHash = true
          //  hash = hashMapSuperlikes[superlike?.identifier]
        }
        let amount = null;
        if (!isNaN(parseFloat(superlike?.amount))) {
          amount = parseFloat(superlike?.amount).toFixed(2);
        }
        return (
          <React.Fragment key={superlike?.identifier}>
            <ListItem
              alignItems="flex-start"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                cursor: url ? 'pointer' : 'default',
                minHeight: '130px',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={async () => {
                if (url) {
                  navigate(url);
                }
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    padding: '0px',
                    display: 'flex',
                  }}
                  alignItems="flex-start"
                  gap={1}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={`/arbitrary/THUMBNAIL/${superlike?.name}/qortal_avatar`}
                  />

                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '18px',
                        }}
                      >
                        <ThumbUpIcon
                          style={{
                            color: 'gold',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '18px',
                          }}
                        >
                          {amount ? amount : ''} QORT
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Spacer height="10px" />
                {message && (
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      fontSize: '15px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {message}
                  </Typography>
                )}

                <Spacer height="10px" />
                {forName && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '17px',
                      gap: '10px',
                      justifyContent: 'flex-start',
                      marginTop: 'auto',
                    }}
                  >
                    <EmojiEventsIcon />
                    {forName}
                  </Box>
                )}
                <Spacer height="10px" />
                <span style={{ fontSize: fontSizeSmall }}>
                  {formatDate(superlike.created)}
                </span>
              </Box>
            </ListItem>
            <Box
              sx={{
                width: '100%',
              }}
            >
              {superlikes.length === index + 1 ? null : <Divider />}
            </Box>
          </React.Fragment>
        );
      })}
    </List>
  );
}
