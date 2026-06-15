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
    imageExtracts,
    videoProcessingProgress,
    framesExtractedCount,
    setVideoProcessingProgress,
    setFramesExtractedCount,
  } = workflow;

  // Calculate overall video processing progress for reference-based publishing
  useEffect(() => {
    if (!videoReference) {
      setVideoProcessingProgress(0);
      return;
    }

    // Total points = 5 (4 frames + 1 duration for single video)
    const totalPoints = 5;
    
    // Calculate completed points
    let completedPoints = 0;
    
    // Count frames extracted (non-empty strings in imageExtracts)
    const extracts = imageExtracts[0] || [];
    const nonEmptyExtracts = extracts.filter((extract: string) => extract && extract.length > 0);
    completedPoints += nonEmptyExtracts.length;
    
    // Add 1 point for duration if it's defined and greater than 0
    if (videoDurations[0] > 0) {
      completedPoints += 1;
    }
    
    // Calculate percentage and truncate to nearest whole number
    const progressPercentage = Math.floor((completedPoints / totalPoints) * 100);
    setVideoProcessingProgress(progressPercentage);
  }, [videoReference, imageExtracts, videoDurations, setVideoProcessingProgress]);

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
              onFrameProgress={(frameIndex, frameCount) => {
                setFramesExtractedCount(prev => {
                  const newCounts = [...prev];
                  newCounts[frameIndex] = frameCount;
                  return newCounts;
                });
              }}
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