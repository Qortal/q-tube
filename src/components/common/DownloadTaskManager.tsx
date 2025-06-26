import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { Movie } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import { DownloadingLight } from "../../assets/svgs/DownloadingLight";
import { DownloadedLight } from "../../assets/svgs/DownloadedLight";

export const DownloadTaskManager: React.FC = () => {
  const { downloads } = useSelector((state: RootState) => state.global);
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openDownload, setOpenDownload] = useState<boolean>(false);

  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );
  const handleClick = (event?: React.MouseEvent<HTMLDivElement>) => {
    const target = event?.currentTarget as unknown as HTMLButtonElement | null;
    setAnchorEl(target);
  };

  const handleCloseDownload = () => {
    setAnchorEl(null);
    setOpenDownload(false);

  };

  useEffect(() => {
    // Simulate downloads for demo purposes

    if (visible) {
      setTimeout(() => {
        setHidden(true);
        setVisible(false);
      }, 3000);
    }
  }, [visible]);

  useEffect(() => {
    if (Object.keys(downloads).length === 0) return;
    setVisible(true);
    setHidden(false);
  }, [downloads]);

  if (!downloads || Object.keys(downloads).length === 0) return null;

  let downloadInProgress = false;
  if (
    Object.keys(downloads).find(
      key =>
        downloads[key]?.status?.status !== "READY" &&
        downloads[key]?.status?.status !== "DOWNLOADED"
    )
  ) {
    downloadInProgress = true;
  }

  return (
    <Box>
      <Button
        sx={{ padding: "0px 0px", minWidth: "0px" }}
        onClick={(e: any) => {
          handleClick(e);
          setOpenDownload(true);
        }}
      >
        {downloadInProgress ? (
          <DownloadingLight
            height="24px"
            width="24px"
            className="download-icon"
          />
        ) : (
          <DownloadedLight height="24px" width="24px" />
        )}
      </Button>

      <Popover
        id={"download-popover"}
        open={openDownload}
        anchorEl={anchorEl}
        onClose={handleCloseDownload}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ marginTop: "12px" }}
      >
        <List
          sx={{
            maxHeight: "50vh",
            overflow: "auto",
            width: "100%",
            maxWidth: "400px",
            gap: "5px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#555555",
          }}
        >
          {Object.keys(downloads).map((download: any) => {
            const downloadObj = downloads[download];
            const progress = downloads[download]?.status?.percentLoaded || 0;
            const status = downloads[download]?.status?.status;
            const service = downloads[download]?.service;
            const id =
              downloadObj?.identifier + "_metadata-" + downloadObj?.name;
            const videoTitle = hashMapVideos[id]?.title;

            return (
              <ListItem
                key={downloadObj?.identifier}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  background: theme.palette.primary.main,
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                  padding: "2px",
                }}
                onClick={() => {
                  const userName = downloadObj?.name;
                  const identifier = downloadObj?.identifier;

                  if (identifier && userName)
                    navigate(`/video/${userName}/${identifier}_metadata`);
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemIcon>
                    {service === "VIDEO" && (
                      <Movie sx={{ color: theme.palette.text.primary }} />
                    )}
                  </ListItemIcon>

                  <Box sx={{ width: "100px", marginLeft: 1, marginRight: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        borderRadius: "5px",
                        color: theme.palette.secondary.main,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Arial",
                      color: theme.palette.text.primary,
                    }}
                    variant="caption"
                  >
                    {`${progress?.toFixed(0)}%`}{" "}
                    {status && status === "REFETCHING" && "- refetching"}
                    {status && status === "DOWNLOADED" && "- building"}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    width: "100%",
                    textAlign: "start",
                    fontFamily: "Arial",
                    color: theme.palette.text.primary,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {videoTitle || downloadObj?.identifier}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </Box>
  );
};
