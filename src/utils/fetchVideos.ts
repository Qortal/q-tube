import { checkStructure } from './checkStructure'

export const fetchAndEvaluateVideos = async (data: any) => {
  const getVideo = async () => {
    const { user, videoId, content } = data
    let obj: any = {
      ...content,
      isValid: false
    }

    if (!user || !videoId) return obj

    try {

      const responseData = await qortalRequest({
        action: 'FETCH_QDN_RESOURCE',
        name: user,
        service: content?.service || 'DOCUMENT',
        identifier: videoId
      })
      if (checkStructure(responseData)) {
        obj = {
          ...content,
          ...responseData,
          isValid: true
        }
      }
      return obj
    } catch (error: any) {
      throw new Error(error?.message || 'error')
    }
  }

  const res = await getVideo()
  return res
}
