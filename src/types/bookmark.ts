import { QortalMetadata } from 'qapp-core';

interface VideoBookmark extends QortalMetadata {
  addedAt: number;
}

export interface BookmarkList {
  id: string;
  title: string;
  description: string;
  created: number;
  updated: number;
  lastAdded: number;
  videos: VideoBookmark[];
  lastAccessed: number;
  type: 'list' | 'playlist' | 'folder';
  playlistReference: string | null;
  folderName: string | null;
}
