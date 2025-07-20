import { Skeleton } from '@mui/material';
import {
  BottomParent,
  NameContainer,
  VideoCard,
  VideoCardCol,
} from './VideoList-styles';
import { useIsMobile } from '../../../hooks/useIsMobile';

export const VideoLoaderItem = ({ status }) => {
  const isMobile = useIsMobile();
  return (
    <VideoCardCol
      sx={{
        ...(isMobile && { width: '100%' }),
      }}
    >
      <VideoCard>
        <Skeleton
          variant="rectangular"
          style={{
            width: isMobile ? '100%' : 320,
            height: 180,
            // borderRadius: '8px',
            alignSelf: 'center',
            maxWidth: '100%',
          }}
        />

        <BottomParent>
          <NameContainer>
            <Skeleton
              variant="circular"
              style={{
                width: 24,
                height: 24,
              }}
            />
            <Skeleton
              variant="rectangular"
              style={{
                width: 200,
                height: 34,
                alignSelf: 'center',
                maxWidth: '100%',
              }}
            />
          </NameContainer>
          <Skeleton
            variant="rectangular"
            style={{
              width: 200,
              height: 15,
              marginTop: '5px',
            }}
          />
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
};
