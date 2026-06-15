export type LikeType = typeof LIKE | typeof DISLIKE | typeof NEUTRAL;

export const LIKE = 'LIKE' as const;
export const DISLIKE = 'DISLIKE' as const;
export const NEUTRAL = 'NEUTRAL' as const;