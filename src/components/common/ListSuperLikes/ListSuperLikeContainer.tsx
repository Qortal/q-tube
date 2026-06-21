import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { Spacer } from 'qapp-core';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { superlikesAtom } from '../../../state/global/superlikes.ts';
import { FormActionButton } from '../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { CustomChip } from '../CustomChip.tsx';
import { PopMenu, PopMenuRefType } from '../PopMenu.tsx';
import ListSuperLikes from './ListSuperLikes';

interface ListSuperLikeContainerProps {
  from: string;
  onClose?: () => void;
}

export const ListSuperLikeContainer = ({
  from,
  onClose,
}: ListSuperLikeContainerProps) => {
  const handleClose = () => {
    if (onClose) onClose();
  };
  const { t } = useTranslation(['core']);

  const [superlikelist] = useAtom(superlikesAtom);
  const isSmall = useIsSmall();
  const theme = useTheme();
  const headerSX = { color: theme.palette.superlike.main };
  const popoverRef = useRef<PopMenuRefType>(null);
  return (
    <Box>
      {from === 'home' && !isSmall ? (
        <Box
          sx={{
            paddingLeft: '5px',
            maxHeight: '55vh',
            outline: `1px solid ${theme.palette.superlike.main}`,
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={headerSX}>
                    {t('core:likes.recent_super_likes', {
                      postProcess: 'capitalizeEachFirstChar',
                    })}
                  </Typography>
                  {onClose && (
                    <IconButton
                      onClick={handleClose}
                      sx={{
                        color: theme.palette.superlike.main,
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
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
            open: false,
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
                    color: theme.palette.superlike.main,
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
            <FormActionButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                if (popoverRef?.current) popoverRef.current.closePopover();
              }}
            >
              {t('core:action.close', {
                postProcess: 'capitalizeFirstWord',
              })}
            </FormActionButton>
          </Box>
          <ListSuperLikes superlikes={superlikelist} />
        </PopMenu>
      ) : null}
    </Box>
  );
};
