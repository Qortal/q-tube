import { useGlobal } from 'qapp-core';

export interface VideoHistoryEntry {
  identifier: string;
  name: string;
  service: string;
  created: number;
  watchedAt: number;
}

/**
 * Adds a video to the watch history if it's not already present.
 * Maintains a maximum of 200 entries, with newest entries first.
 *
 * @param videoReference - The video reference to add to history
 * @param watchedHistory - Current watch history array
 * @param setWatchedHistory - Function to update watch history
 * @param lists - Global lists object from qapp-core
 */
export const addToWatchHistory = (
  videoReference: VideoHistoryEntry,
  watchedHistory: VideoHistoryEntry[],
  setWatchedHistory: React.Dispatch<React.SetStateAction<VideoHistoryEntry[]>>,
  lists: any
) => {
  const exists = watchedHistory.some(
    (v) =>
      v.identifier === videoReference.identifier &&
      v.name === videoReference.name &&
      v.service === videoReference.service
  );

  if (exists) return; // Already in history, don't add again

  lists.deleteList('watched-history');
  // Add to beginning, then keep only latest 200
  setWatchedHistory((prev) => [videoReference, ...prev].slice(0, 200));
};