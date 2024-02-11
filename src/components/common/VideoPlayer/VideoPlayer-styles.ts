import { styled } from "@mui/system";
import { Box } from "@mui/material";

export const VideoContainer = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  max-height: 70vh;
`;

export const VideoElement = styled("video")`
  width: 100%;
  background: rgb(33, 33, 33);
  max-height: 70vh;
`;

export const ControlsContainer = styled(Box)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;
