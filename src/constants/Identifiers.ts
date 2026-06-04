export const useTestIdentifiers = true;
const baseIdentifier = useTestIdentifiers ? 'MYTEST_' : 'qtube_';

export const QTUBE_VIDEO_BASE = baseIdentifier + 'vid_';
export const QTUBE_PLAYLIST_BASE = baseIdentifier + 'playlist_';

export const SUPER_LIKE_BASE = baseIdentifier + 'superlike_';
export const LIKE_BASE = baseIdentifier + 'like_';
export const COMMENT_BASE = 'qc_v1_' + baseIdentifier;
export const FOR = useTestIdentifiers ? 'FORTEST5' : 'FOR096';
export const FOR_SUPER_LIKE = baseIdentifier + 'sl';

// updates trigger
export const trigger_like_identifier = 1759360823338;
