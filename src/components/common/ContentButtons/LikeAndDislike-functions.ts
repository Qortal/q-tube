import { fetchResourcesByIdentifier } from "../../../utils/qortalRequestFunctions.ts";
import { DISLIKE, LIKE, LikeType, NEUTRAL } from "./LikeAndDislike.tsx";

export const getCurrentLikeType = async (
  username: string,
  likeIdentifier: string
): Promise<LikeType> => {
  try {
    const response = await qortalRequest({
      action: "FETCH_QDN_RESOURCE",
      name: username,
      service: "CHAIN_COMMENT",
      identifier: likeIdentifier,
    });
    return response?.likeType;
  } catch (e) {
    console.log("liketype error: ", e);
    return NEUTRAL;
  }
};

type ResourceType = { likeType: LikeType };
export type LikesAndDislikes = { likes: number; dislikes: number };
const countLikesAndDislikes = (likesAndDislikes: ResourceType[]) => {
  let totalLikeCount = 0;
  let totalDislikeCount = 0;
  likesAndDislikes.map(likeOrDislike => {
    const likeType = likeOrDislike.likeType;
    if (likeType === LIKE) totalLikeCount += 1;
    if (likeType === DISLIKE) totalDislikeCount += 1;
  });
  return {
    likes: totalLikeCount,
    dislikes: totalDislikeCount,
  } as LikesAndDislikes;
};
export const getCurrentLikesAndDislikesCount = async (
  likeIdentifier: string
) => {
  try {
    const likesAndDislikes = await fetchResourcesByIdentifier<ResourceType>(
      "CHAIN_COMMENT",
      likeIdentifier
    );
    return countLikesAndDislikes(likesAndDislikes);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export function formatLikeCount(likeCount: number, decimals = 2) {
  if (!+likeCount) return "";

  const sigDigits = Math.floor(Math.log10(likeCount) / 3);
  if (sigDigits < 1) return likeCount.toString();

  const sigDigitSize = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["K", "M", "B"];

  const sigDigitsToTheThousands = Math.pow(sigDigitSize, sigDigits);
  const sigDigitLikeCount = (likeCount / sigDigitsToTheThousands).toFixed(dm);

  return `${sigDigitLikeCount}${sizes[sigDigits - 1] || ""}`;
}
