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

export const VideoFileDataForm: React.FC = () => {
  const workflow = usePublishVideo();
  const [refreshKeys, setRefreshKeys] = useState<number[]>([]);

  const {
    files,
    videoDurations,
    setVideoDurations,
    assembleVideoDurations,
    onFramesExtracted,
    setFiles,
    handleOnchange,
    isCheckSameCoverImage,
  } = workflow;

  // Initialize refresh keys when files change
  useEffect(() => {
    if (files.length > 0) {
      setRefreshKeys(new Array(files.length).fill(0));
    }
  }, [files.length]);

  // Call assembleVideoDurations in useEffect to avoid state update during render
  useEffect(() => {
    assembleVideoDurations();
  }, [files.length, videoDurations.length, assembleVideoDurations]);

  const handleRefreshDuration = (index: number) => {
    // Force the specific FrameExtractor to remount by changing its key
    const newRefreshKeys = [...refreshKeys];
    newRefreshKeys[index] = (newRefreshKeys[index] || 0) + 1;
    setRefreshKeys(newRefreshKeys);
    
    // Reset the duration for this video
    const newVideoDurations = [...videoDurations];
    newVideoDurations[index] = 0;
    setVideoDurations(newVideoDurations);
  };

  return (
    <>
      {files?.length > 0 && (
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
          
          {files.map((file, index) => (
            <React.Fragment key={index}>
              <FrameExtractor
                key={refreshKeys[index] || 0}
                videoFile={file.file || undefined}
                onFramesExtracted={async (imgs) => onFramesExtracted(imgs, index)}
                videoDurations={videoDurations}
                setVideoDurations={setVideoDurations}
                index={index}
              />
              
              {!isCheckSameCoverImage && (
                <VideoCoverImage
                  coverImage={file?.coverImage || ''}
                  onCoverImageChange={(img: string) =>
                    handleOnchange(index, 'coverImage', img, setFiles)
                  }
                />
              )}

              <VideoTitleInput
                value={file.title || ''}
                onChange={(value: string) =>
                  handleOnchange(index, 'title', value, setFiles)
                }
              />
              
              <VideoFilenameDisplay filename={file?.file?.name || ''} />
              
              <VideoDurationDisplay
                duration={videoDurations[index] || 0}
                onRefresh={() => handleRefreshDuration(index)}
              />
              
              <VideoDescriptionEditor
                value={file?.description || ''}
                onChange={(value: string) =>
                  handleOnchange(index, 'description', value, setFiles)
                }
              />
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};