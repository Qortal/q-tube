// hooks/useMediaInfo.ts
import { useRef, useEffect } from 'react';
import mediaInfoFactory, {
  type MediaInfo,
  type ReadChunkFunc,
} from 'mediainfo.js';

function makeReadChunk(file: File): ReadChunkFunc {
  return async (chunkSize: number, offset: number) =>
    new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer());
}

export function useMediaInfo() {
  const mediaInfoRef = useRef<MediaInfo<'text'> | null>(null);
  const isReady = useRef(false);

  useEffect(() => {
    mediaInfoFactory({
      format: 'text',
      locateFile: () => `${import.meta.env.BASE_URL}MediaInfoModule.wasm`,
    })
      .then((mi) => {
        mediaInfoRef.current = mi;
        isReady.current = true;
      })
      .catch((err) => {
        console.error('Failed to load MediaInfo WASM:', err);
        isReady.current = false;
      });

    return () => {
      mediaInfoRef.current?.close();
    };
  }, []);

  /**
   * Analyzes the file and returns the full MediaInfo text output.
   */
  async function getMediaInfo(file: File): Promise<string | null> {
    if (!isReady.current || !mediaInfoRef.current) {
      console.warn('MediaInfo not ready');
      return null;
    }

    try {
      return await mediaInfoRef.current.analyzeData(
        file.size,
        makeReadChunk(file)
      );
    } catch (err) {
      console.error('Failed to analyze media info:', err);
      return null;
    }
  }

  /**
   * Detects if the file uses HEVC (H.265) codec.
   */
  async function isHEVC(file: File): Promise<boolean> {
    const result = await getMediaInfo(file);
    if (!result) return false;

    // Normalize result and match HEVC in a more robust way
    const normalized = result.toLowerCase();
    return normalized.includes('format') && normalized.includes('hevc');
  }

  return {
    getMediaInfo,
    isHEVC,
    isReady: isReady.current,
  };
}
