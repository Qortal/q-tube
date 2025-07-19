import { Box, ButtonBase, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import { CopyLinkButton } from '../../../components/common/ContentButtons/CopyLinkButton.tsx';
import { IndexButton } from '../../../components/common/ContentButtons/IndexButton.tsx';
import { LikeAndDislike } from '../../../components/common/ContentButtons/LikeAndDislike.tsx';
import { SuperLike } from '../../../components/common/ContentButtons/SuperLike.tsx';
import FileElement from '../../../components/common/FileElement.tsx';
import { titleFormatterOnSave } from '../../../constants/Misc.ts';
import { ChannelActions } from './ChannelActions.tsx';
import {
  FileAttachmentContainer,
  FileAttachmentFont,
} from './VideoContent-styles.tsx';
import { AddToBookmarks } from '../../../components/common/ContentButtons/AddToBookmarks.tsx';

export interface VideoActionsBarProps {
  channelName: string;
  videoData: any;
  videoReference: any;
  superLikeList: any[];
  setSuperLikeList: React.Dispatch<React.SetStateAction<any[]>>;
  sx?: SxProps<Theme>;
}

function replaceAppNameInQortalUrl(url: string, newAppName: string): string {
  return url.replace(/(qortal:\/\/APP\/)[^/]+/, `$1${newAppName}`);
}

export const VideoActionsBar = ({
  channelName,
  videoData,
  videoReference,
  superLikeList,
  setSuperLikeList,
  sx,
}: VideoActionsBarProps) => {
  console.log('videoData', videoData);
  const calculateAmountSuperlike = useMemo(() => {
    const totalQort = superLikeList?.reduce((acc, curr) => {
      if (curr?.amount && !isNaN(parseFloat(curr.amount)))
        return acc + parseFloat(curr.amount);
      else return acc;
    }, 0);
    return totalQort?.toFixed(2);
  }, [superLikeList]);

  const numberOfSuperlikes = useMemo(() => {
    return superLikeList?.length ?? 0;
  }, [superLikeList]);

  const saveAsFilename = useMemo(() => {
    // nb. we prefer to construct the local filename to use for
    // saving, from the video "title" when possible
    if (videoData?.title) {
      // figure out filename extension
      let ext = '.mp4';
      if (videoData?.filename) {
        // nb. this regex copied from https://stackoverflow.com/a/680982
        const re = /(?:\.([^.]+))?$/;
        const match = re.exec(videoData.filename);
        if (match[1]) {
          ext = '.' + match[1];
        }
      }

      return (videoData.title + ext).replace(titleFormatterOnSave, '');
    }

    // otherwise use QDN filename if applicable
    if (videoData?.filename) {
      return videoData.filename.replace(titleFormatterOnSave, '');
    }

    // TODO: this was the previous value, leaving here as the
    // fallback for now even though it probably is not needed..?
    return videoData?.filename || videoData?.title?.slice(0, 20) + '.mp4';
  }, [videoData]);

  return (
    <Box
      sx={{
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        ...sx,
      }}
    >
      <ChannelActions channelName={channelName} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          alignItems: 'center',
        }}
      >
        {videoData && (
          <>
            <LikeAndDislike name={videoData?.user} identifier={videoData?.id} />
            <SuperLike
              numberOfSuperlikes={numberOfSuperlikes}
              totalAmount={calculateAmountSuperlike}
              name={videoData?.user}
              service={videoData?.service}
              identifier={videoData?.id}
              onSuccess={(val) => {
                setSuperLikeList((prev) => [val, ...prev]);
              }}
            />
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
        <AddToBookmarks
          metadataReference={{
            identifier: videoData?.id,
            service: 'DOCUMENT',
            name: videoData?.user,
          }}
        />
        <IndexButton channelName={channelName} />
        <CopyLinkButton
          link={`qortal://APP/Q-Tube/video/${encodeURIComponent(videoData?.user)}/${encodeURIComponent(videoData?.id)}`}
          tooltipTitle={`Copy video link`}
        />
      </Box>
      {videoData && (
        <ButtonBase>
          <FileElement
            fileInfo={{
              ...videoReference,
              filename: saveAsFilename,
              mimeType: videoData?.videoType || '"video/mp4',
            }}
            title={videoData?.filename || videoData?.title?.slice(0, 20)}
            customStyles={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          />
        </ButtonBase>
      )}
    </Box>
  );
};
