import { MoreVert as MoreIcon } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useVideoContext } from "./VideoContext.ts";
import {
  FullscreenButton,
  PictureInPictureButton,
  PlaybackRate,
  PlayButton,
  ProgressSlider,
  ReloadButton,
  VideoTime,
  VolumeButton,
  VolumeSlider,
} from "./VideoControls.tsx";

export const MobileControlsBar = () => {
  const { handleMenuOpen, handleMenuClose, anchorEl } = useVideoContext();

  const controlGroupSX = { display: "flex", gap: "5px", alignItems: "center" };

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
          sx={{ minWidth: "30px", paddingLeft: "0px" }}
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
          <VolumeButton />
          <VolumeSlider />
        </MenuItem>
        <MenuItem>
          <PictureInPictureButton />
        </MenuItem>
      </Menu>
    </>
  );
};
