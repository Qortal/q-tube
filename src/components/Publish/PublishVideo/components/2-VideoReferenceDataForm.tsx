import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FrameExtractor } from '../../../common/FrameExtractor/FrameExtractor.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';
import {
  VideoCategorySelection,
  VideoCoverImage,
  VideoCoverImageForAll,
  VideoDescriptionEditor,
  VideoDurationDisplay,
  VideoFilenameDisplay,
  VideoTitleInput,
} from './VideoFormElements.tsx';

export const VideoReferenceDataForm: React.FC = () => {
  const workflow = usePublishVideo();
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    videoReference,
    videoTitle,
    setVideoTitle,
    videoDurations,
    setVideoDurations,
    onFramesExtracted,
    handleOnchange,
    isCheckSameCoverImage,
    videoFileExtension,
    assembleVideoDurations,
    fetchedVideoData,
    videoReferenceDescription,
    setVideoReferenceDescription,
    videoReferenceCoverImage,
    setVideoReferenceCoverImage,
  } = workflow;

  return (
    <>
      {videoReference && (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <VideoCategorySelection />
          </Box>
          
          {isCheckSameCoverImage && <VideoCoverImageForAll />}
          
          <React.Fragment>
            <FrameExtractor
              key={refreshKey}
              videoFile={undefined}
              fileReference={{
                name: videoReference.name,
                service: videoReference.service,
                identifier: videoReference.identifier,
              }}
              onFramesExtracted={async (imgs) => onFramesExtracted(imgs, 0)}
              videoDurations={videoDurations}
              setVideoDurations={setVideoDurations}
              index={0}
              shouldProcess={true}
            />
            
            {!isCheckSameCoverImage && (
              <VideoCoverImage
                coverImage={videoReferenceCoverImage}
                onCoverImageChange={setVideoReferenceCoverImage}
              />
            )}

            <VideoTitleInput
              value={videoTitle || ''}
              onChange={setVideoTitle}
            />
            
            <VideoFilenameDisplay
              filename={videoTitle || 'Video'}
              fileExtension={videoFileExtension}
            />
            
            <VideoDurationDisplay
              duration={videoDurations[0] || 0}
            />
            
            <VideoDescriptionEditor
              value={videoReferenceDescription}
              onChange={setVideoReferenceDescription}
            />
          </React.Fragment>
        </>
      )}
    </>
  );
};