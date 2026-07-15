import type { Service } from 'qapp-core';

/**
 * Full set of valid Qortal `Service` values, mirrored from
 * `qapp-core`'s `Service` type. Used to verify that a resource
 * reference carries a service the chain actually recognises.
 *
 * Kept as a runtime array (the TS type is erased at runtime) so we
 * can validate untrusted JSON from QDN searches.
 */
const VALID_SERVICES: ReadonlySet<string> = new Set<Service>([
  'APP',
  'ARBITRARY_DATA',
  'ATTACHMENT',
  'ATTACHMENT_PRIVATE',
  'AUDIO',
  'AUDIO_PRIVATE',
  'AUTO_UPDATE',
  'BLOG',
  'BLOG_COMMENT',
  'BLOG_POST',
  'CHAIN_COMMENT',
  'CHAIN_DATA',
  'CODE',
  'COMMENT',
  'COUPON',
  'DATABASE',
  'DOCUMENT',
  'DOCUMENT_PRIVATE',
  'EXTENSION',
  'FILE',
  'FILE_PRIVATE',
  'FILES',
  'GAME',
  'GIF_REPOSITORY',
  'IMAGE',
  'IMAGE_PRIVATE',
  'ITEM',
  'JSON',
  'LIST',
  'MAIL',
  'MAIL_PRIVATE',
  'MESSAGE',
  'MESSAGE_PRIVATE',
  'METADATA',
  'NFT',
  'OFFER',
  'PLAYLIST',
  'PLUGIN',
  'PODCAST',
  'PRODUCT',
  'QCHAT_ATTACHMENT',
  'QCHAT_ATTACHMENT_PRIVATE',
  'QCHAT_AUDIO',
  'QCHAT_IMAGE',
  'QCHAT_VOICE',
  'SNAPSHOT',
  'STORE',
  'THUMBNAIL',
  'VIDEO',
  'VIDEO_PRIVATE',
  'VOICE',
  'VOICE_PRIVATE',
  'WEBSITE',
]);

/**
 * Required fields on a published Q-Tube video metadata document.
 *
 * `duration` is intentionally omitted: many videos were published
 * before that field existed, so it must stay optional.
 */
const REQUIRED_VIDEO_FIELDS = ['title', 'videoReference', 'filename'] as const;

/**
 * Required fields on a published Q-Tube playlist metadata document.
 *
 * Playlists always carry a `title` and a `videos` array. Each member
 * of `videos` is a reference to a video resource and is validated via
 * {@link isValidVideoReference}.
 */
const REQUIRED_PLAYLIST_FIELDS = ['title', 'videos'] as const;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value) && value > 0;

/**
 * Validates that an object looks like a Qortal resource reference
 * (`QortalGetMetadata` shape) coming from untrusted QDN data.
 *
 * Checks: non-empty `name`, non-empty `identifier`, and a `service`
 * that is one of the recognised Qortal `Service` values.
 */
export const isValidVideoReference = (ref: any): boolean => {
  if (!ref || typeof ref !== 'object') return false;
  if (!isNonEmptyString(ref.name)) return false;
  if (!isNonEmptyString(ref.identifier)) return false;
  if (!isNonEmptyString(ref.service)) return false;
  if (!VALID_SERVICES.has(ref.service)) return false;
  return true;
};

/**
 * Validates a fetched Q-Tube video metadata document.
 *
 * Required: `title`, `videoReference` (valid reference), `filename`.
 * `duration` and `fileSize` are optional because legacy videos predate
 * them. Silently returns `false` for any missing/empty field so callers
 * can drop spam publishes without console noise.
 */
export const isValidVideoMetadata = (video: any): boolean => {
  if (!video || typeof video !== 'object') return false;

  for (const field of REQUIRED_VIDEO_FIELDS) {
    if (video[field] === undefined || video[field] === null) return false;
  }

  if (!isNonEmptyString(video.title)) return false;
  if (!isNonEmptyString(video.filename)) return false;
  if (!isValidVideoReference(video.videoReference)) return false;

  // duration optional, but if present must be a non-negative number
  if (video.duration !== undefined && video.duration !== null) {
    if (
      typeof video.duration !== 'number' ||
      Number.isNaN(video.duration) ||
      video.duration < 0
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Validates a fetched Q-Tube playlist metadata document.
 *
 * Required: non-empty `title` and a `videos` array. Every member of
 * `videos` must itself be a valid video reference (name + identifier +
 * service). An empty `videos` array is allowed (a playlist can be
 * freshly created with no members yet) but the field must exist and
 * be an array.
 */
export const isValidPlaylistMetadata = (playlist: any): boolean => {
  if (!playlist || typeof playlist !== 'object') return false;

  for (const field of REQUIRED_PLAYLIST_FIELDS) {
    if (playlist[field] === undefined || playlist[field] === null) return false;
  }

  if (!isNonEmptyString(playlist.title)) return false;
  if (!Array.isArray(playlist.videos)) return false;

  for (const member of playlist.videos) {
    if (!isValidVideoReference(member)) return false;
  }

  return true;
};

/**
 * Returns an array of field names that are missing or invalid in a video
 * metadata object. Used to provide detailed feedback to publishers about
 * why their video is invalid.
 */
export const getInvalidVideoFields = (video: any): string[] => {
  const invalidFields: string[] = [];

  if (!video || typeof video !== 'object') {
    return ['metadata'];
  }

  if (!isNonEmptyString(video.title)) {
    invalidFields.push('title');
  }

  if (!isValidVideoReference(video.videoReference)) {
    invalidFields.push('videoReference');
  }

  if (!isNonEmptyString(video.filename)) {
    invalidFields.push('filename');
  }

  if (
    video.duration !== undefined &&
    video.duration !== null &&
    (typeof video.duration !== 'number' ||
      Number.isNaN(video.duration) ||
      video.duration < 0)
  ) {
    invalidFields.push('duration');
  }

  return invalidFields;
};

/**
 * Returns an array of field names that are missing or invalid in a playlist
 * metadata object. Used to provide detailed feedback to publishers about
 * why their playlist is invalid.
 */
export const getInvalidPlaylistFields = (playlist: any): string[] => {
  const invalidFields: string[] = [];

  if (!playlist || typeof playlist !== 'object') {
    return ['metadata'];
  }

  if (!isNonEmptyString(playlist.title)) {
    invalidFields.push('title');
  }

  if (!Array.isArray(playlist.videos)) {
    invalidFields.push('videos');
  } else {
    for (let i = 0; i < playlist.videos.length; i++) {
      if (!isValidVideoReference(playlist.videos[i])) {
        invalidFields.push(`videos[${i}]`);
      }
    }
  }

  return invalidFields;
};

/**
 * Legacy alias kept for backward compatibility. Previously a stub that
 * always returned `true`; now delegates to {@link isValidVideoMetadata}
 * so any existing callers get real validation for free.
 */
export const checkStructure = (content: any): boolean =>
  isValidVideoMetadata(content);
