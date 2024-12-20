import { styled } from "@mui/system";
import { Box } from "@mui/material";

export const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  "&:focus": { outline: "none" },
}));

export const VideoElement = styled("video")(({ theme }) => ({
  width: "100%",
  background: "rgb(33, 33, 33)",
}));
//1075 x 604
export const ControlsContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.6);
`;
