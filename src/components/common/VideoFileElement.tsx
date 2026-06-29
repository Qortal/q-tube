import FileElement from './FileElement';
import { usePersistedState } from '../../state/persist/persist';
import { useGlobal } from 'qapp-core';
import { useState } from 'react';
import { addToWatchHistory } from '../../utils/watchHistory';

interface VideoFileElementProps {
  title: string;
  description?: string;
  author?: string;
  fileInfo?: any;
  postId?: string;
  user?: string;
  children?: React.ReactNode;
  mimeType?: string;
  disable?: boolean;
  mode?: string;
  otherUser?: string;
  customStyles?: any;
  videoReference?: {
    identifier: string;
    name: string;
    service: string;
    created?: number;
  };
}

export const VideoFileElement = ({
  videoReference,
  ...props
}: VideoFileElementProps) => {
  const { lists } = useGlobal();
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState<any[]>('watched-v1', []);
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);

  const handleDownloadStart = () => {
    if (!isHydratedWatchedHistory || hasAddedToHistory || !videoReference)
      return;

    // Add to history when download is initiated
    const videoHistoryEntry = {
      identifier: videoReference.identifier + '_metadata',
      name: videoReference.name,
      service: 'DOCUMENT',
      created: videoReference.created || Date.now(),
      watchedAt: Date.now(),
    };

    addToWatchHistory(
      videoHistoryEntry,
      watchedHistory,
      setWatchedHistory,
      lists
    );
    setHasAddedToHistory(true);
  };

  return <FileElement {...props} onDownloadStart={handleDownloadStart} />;
};
