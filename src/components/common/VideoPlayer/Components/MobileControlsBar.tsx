import { MoreVert as MoreIcon } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useVideoContext } from "./VideoContext.ts";
import {
  FullscreenButton,
  ObjectFitButton,
  PictureInPictureButton,
  PlaybackRate,
  PlayButton,
  ProgressSlider,
  ReloadButton,
  VideoTime,
  VolumeControl,
} from "./VideoControls.tsx";

export const MobileControlsBar = () => {
  const { handleMenuOpen, handleMenuClose, anchorEl, controlsHeight } =
    useVideoContext();

  const controlGroupSX = {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    height: controlsHeight,
  };

  return (
    <>
      <Box sx={controlGroupSX}>
        <PlayButton />
        <ReloadButton />
        <ProgressSlider />
        <VideoTime />
      </Box>

      <Box sx={controlGroupSX}>
        <PlaybackRate />
        <FullscreenButton />

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ paddingLeft: "0px", marginRight: "0px" }}
        >
          <MoreIcon />
        </IconButton>
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl.value}
        keepMounted
        open={Boolean(anchorEl.value)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: "250px",
          },
        }}
      >
        <MenuItem>
          <ObjectFitButton />
        </MenuItem>
        <MenuItem>
          <PictureInPictureButton />
        </MenuItem>
      </Menu>
    </>
  );
};
