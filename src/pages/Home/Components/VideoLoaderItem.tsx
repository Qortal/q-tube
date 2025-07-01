import { Skeleton } from '@mui/material';
import {
  BottomParent,
  NameContainer,
  VideoCard,
  VideoCardCol,
} from './VideoList-styles';

export const VideoLoaderItem = ({ status }) => {
  return (
    <VideoCardCol>
      <VideoCard>
        <Skeleton
          variant="rectangular"
          style={{
            width: 320,
            height: 180,
            borderRadius: '8px',
            marginTop: 10,
            alignSelf: 'center',
            maxWidth: '100%',
          }}
        />

        <BottomParent>
          <NameContainer>
            <Skeleton
              variant="rectangular"
              style={{
                width: 200,
                height: 50,
                marginTop: 12,
                alignSelf: 'center',
                maxWidth: '100%',
              }}
            />
          </NameContainer>
          <Skeleton
            variant="rectangular"
            style={{
              width: 200,
              height: 24,
              marginTop: 15,
              alignSelf: 'center',
            }}
          />
          <Skeleton
            variant="rectangular"
            style={{
              width: 200,
              height: 24,
              marginTop: 15,
              alignSelf: 'center',
            }}
          />
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
};
