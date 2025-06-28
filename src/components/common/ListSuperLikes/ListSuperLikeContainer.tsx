import { Box, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useRef } from 'react';
import { fontSizeSmall } from '../../../constants/Misc.ts';
import { CrowdfundActionButton } from '../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { PopMenu, PopMenuRefType } from '../PopMenu.tsx';
import ListSuperLikes from './ListSuperLikes';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAtom } from 'jotai';
import { superlikesAtom } from '../../../state/global/superlikes.ts';
export const ListSuperLikeContainer = () => {
  const [superlikelist] = useAtom(superlikesAtom);

  const isScreenLarge = useMediaQuery('(min-width:1200px)');

  const headerSX = { fontSize: fontSizeSmall, color: 'gold' };

  const popoverRef = useRef<PopMenuRefType>(null);
  return (
    <Box sx={{ paddingLeft: '5px' }}>
      {isScreenLarge ? (
        <>
          <Typography sx={headerSX}>Recent Super likes</Typography>
          <ListSuperLikes superlikes={superlikelist} />
        </>
      ) : (
        <PopMenu
          showExpandIcon={false}
          popoverProps={{
            open: undefined,
            sx: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '40px',
            },
            anchorReference: 'none',
          }}
          ref={popoverRef}
          MenuHeader={
            <Tooltip title={'Show recent Superlikes'} placement={'left'} arrow>
              <Box
                sx={{
                  padding: '5px',
                  borderRadius: '7px',
                  outline: '1px gold solid',
                  height: '53px',
                  position: 'absolute',
                  top: '60px',
                  right: '2%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ThumbUpIcon
                  style={{
                    color: 'gold',
                  }}
                />
              </Box>
            </Tooltip>
          }
        >
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#1A1C1E',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={headerSX}>Recent Superlikes</Typography>
            <CrowdfundActionButton
              variant="contained"
              color="error"
              sx={{
                height: '25px',
                width: '75px',
                marginRight: '5px',
              }}
              onClick={() => {
                if (popoverRef?.current) popoverRef.current.closePopover();
              }}
            >
              CLOSE
            </CrowdfundActionButton>
          </Box>
          <ListSuperLikes superlikes={superlikelist} />
        </PopMenu>
      )}
    </Box>
  );
};
