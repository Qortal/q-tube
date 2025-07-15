export const useTestIdentifiers = false;
export const QTUBE_VIDEO_BASE = useTestIdentifiers
  ? '2MYTEST_vid_'
  : 'qtube_vid_';
export const QTUBE_PLAYLIST_BASE = useTestIdentifiers
  ? '2MYTEST_playlist_'
  : 'qtube_playlist_';
export const SUPER_LIKE_BASE = useTestIdentifiers
  ? '2MYTEST_superlike_'
  : 'qtube_superlike_';

export const LIKE_BASE = useTestIdentifiers ? '2MYTEST_like_' : 'qtube_like_';

export const COMMENT_BASE = useTestIdentifiers
  ? '2qc_v1_MYTEST_'
  : 'qc_v1_qtube_';
export const FOR = useTestIdentifiers ? '2FORTEST5' : 'FOR096';
export const FOR_SUPER_LIKE = useTestIdentifiers ? '2MYTEST_sl' : `qtube_sl`;
export const FOR_LIKE = useTestIdentifiers ? '2MYTEST_like' : `qtube_like`;
