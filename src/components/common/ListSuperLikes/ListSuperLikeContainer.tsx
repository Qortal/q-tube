import {
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRef } from 'react';
import { CrowdfundActionButton } from '../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { PopMenu, PopMenuRefType } from '../PopMenu.tsx';
import ListSuperLikes from './ListSuperLikes';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAtom } from 'jotai';
import { superlikesAtom } from '../../../state/global/superlikes.ts';
import { Spacer } from 'qapp-core';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomChip } from '../../../pages/Home/FilterOptions.tsx';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { useTranslation } from 'react-i18next';
export const ListSuperLikeContainer = ({ from }) => {
  const { t } = useTranslation(['core']);

  const [superlikelist] = useAtom(superlikesAtom);
  const isSmall = useIsSmall();
  const headerSX = { color: 'gold' };
  const theme = useTheme();
  const popoverRef = useRef<PopMenuRefType>(null);
  return (
    <Box>
      {from === 'home' && !isSmall ? (
        <Box
          sx={{
            paddingLeft: '5px',
            maxHeight: '55vh',
            outline: '1px solid gold',
            padding: '5px',
            overflow: 'hidden',
            width: 300,
            maxWidth: '100%',
            flexShrink: 0,
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            visibility: superlikelist?.length === 0 ? 'hidden' : 'visible',
          }}
        >
          <AnimatePresence>
            {superlikelist?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <Typography sx={headerSX}>
                  {t('core:likes.recent_super_likes', {
                    postProcess: 'capitalizeEachFirstChar',
                  })}
                </Typography>
                <Spacer height="10px" />
                <ListSuperLikes superlikes={superlikelist} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      ) : from === 'filters' ? (
        <PopMenu
          showExpandIcon={false}
          popoverProps={{
            open: undefined,
            sx: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '40px',
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.background.default,
                overflow: 'hidden',
                minHeight: '400px',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              '& .MuiPaper-root > .MuiBox-root': {
                flexGrow: 1,
              },
            },
            anchorReference: 'none',
          }}
          ref={popoverRef}
          MenuHeader={
            <CustomChip
              icon={
                <ThumbUpIcon
                  fontSize="small"
                  style={{
                    color: 'gold',
                  }}
                />
              }
              label="Superlikes"
              sx={(theme) => {
                return {
                  fontWeight: 400,
                };
              }}
            />
          }
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
            }}
          >
            <Typography sx={headerSX}>
              {' '}
              {t('core:likes.recent_super_likes', {
                postProcess: 'capitalizeEachFirstChar',
              })}
            </Typography>
            <CrowdfundActionButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                if (popoverRef?.current) popoverRef.current.closePopover();
              }}
            >
              CLOSE
            </CrowdfundActionButton>
          </Box>
          <ListSuperLikes superlikes={superlikelist} />
        </PopMenu>
      ) : null}
    </Box>
  );
};
