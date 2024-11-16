import { Box, CircularProgress, Typography } from "@mui/material";
import { setVideoPlaying } from "../../../../state/features/globalSlice.ts";
import { useDispatch } from "react-redux";
import { PlayArrow } from "@mui/icons-material";
import { formatTime } from "../../../../utils/numberFunctions.ts";
import { useVideoContext } from "./VideoContext.ts";

export const LoadingVideo = () => {
  const {
    isLoading,
    resourceStatus,
    src,
    startPlay,
    canPlay,
    from,
    togglePlay,
    duration,
  } = useVideoContext();

  const getDownloadProgress = (current: number, total: number) => {
    const progress = (current / total) * 100;
    return Number.isNaN(progress) ? "" : progress.toFixed(0) + "%";
  };

  const dispatch = useDispatch();
  return (
    <>
      {isLoading.value && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={resourceStatus?.status === "READY" ? "55px " : 0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={25}
          bgcolor="rgba(0, 0, 0, 0.6)"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            height: "100%",
          }}
        >
          <CircularProgress color="secondary" />
          {resourceStatus && (
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                color: "white",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              {resourceStatus?.status === "NOT_PUBLISHED" && (
                <>Video file was not published. Please inform the publisher!</>
              )}
              {resourceStatus?.status === "REFETCHING" ? (
                <>
                  <>
                    {getDownloadProgress(
                      resourceStatus?.localChunkCount,
                      resourceStatus?.totalChunkCount
                    )}
                  </>

                  <> Refetching in 25 seconds</>
                </>
              ) : resourceStatus?.status === "DOWNLOADED" ? (
                <>Download Completed: building video...</>
              ) : resourceStatus?.status !== "READY" ? (
                <>
                  {getDownloadProgress(
                    resourceStatus?.localChunkCount,
                    resourceStatus?.totalChunkCount
                  )}
                </>
              ) : (
                <>Fetching video...</>
              )}
            </Typography>
          )}
        </Box>
      )}

      {((!src && !isLoading.value) || (!startPlay.value && !canPlay.value)) && (
        <>
          {duration && (
            <Box
              position="absolute"
              right={0}
              bottom={0}
              bgcolor="#202020"
              zIndex={999}
            >
              <Typography color="white">{formatTime(duration)}</Typography>
            </Box>
          )}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={500}
            bgcolor="rgba(0, 0, 0, 0.6)"
            onClick={() => {
              if (from === "create") return;
              dispatch(setVideoPlaying(null));

              togglePlay();
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            <PlayArrow
              sx={{
                width: "50px",
                height: "50px",
                color: "white",
              }}
            />
          </Box>
        </>
      )}
    </>
  );
};
