export const useTestIdentifiers = false;
export const QTUBE_VIDEO_BASE = useTestIdentifiers
  ? 'MYTEST2_vid_'
  : 'qtube_vid_';
export const QTUBE_PLAYLIST_BASE = useTestIdentifiers
  ? 'MYTEST2_playlist_'
  : 'qtube_playlist_';
export const SUPER_LIKE_BASE = useTestIdentifiers
  ? 'MYTEST2_superlike_'
  : 'qtube_superlike_';

export const LIKE_BASE = useTestIdentifiers ? 'MYTEST2_like_' : 'qtube_like_';

export const COMMENT_BASE = useTestIdentifiers
  ? 'qc_v1_MYTEST2_'
  : 'qc_v1_qtube_';
export const FOR = useTestIdentifiers ? 'FORTEST52' : 'FOR0962';
export const FOR_SUPER_LIKE = useTestIdentifiers ? 'MYTEST2_sl' : `qtube_sl`;
export const FOR_LIKE = useTestIdentifiers ? 'MYTEST2_like' : `qtube_like`;
