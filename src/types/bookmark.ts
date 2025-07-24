import { QortalMetadata } from 'qapp-core';

interface VideoBookmark extends QortalMetadata {
  addedAt: number;
  type: 'video' | 'playlist';
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
  type: 'list' | 'folder';
  // New: for folders only
  children?: string[];
}
