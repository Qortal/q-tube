import { styled } from "@mui/system";
import { Box, Grid, Typography, Checkbox } from "@mui/material";


export const SubtitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: 'center',
  margin: '10px 0px',
  width: '100%'
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '20px'
}));

const DoubleLine = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`
export const ChannelTitle = styled(DoubleLine)(({ theme }) => ({
  fontFamily: "Cairo",
  fontSize: "20px",
  letterSpacing: "0.4px",
  color: theme.palette.text.primary,
  userSelect: "none",
  marginBottom: 'auto',
  textAlign: 'center'
}));
export const WelcomeTitle = styled(DoubleLine)(({ theme }) => ({
  fontFamily: "Cairo",
  fontSize: "24px",
  letterSpacing: "0.4px",
  color: theme.palette.text.primary,
  userSelect: "none",
  textAlign: 'center'
}));

export const WelcomeContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: '90%',
  height: '90%',
  backgroundColor: theme.palette.background.paper,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));


export const ChannelCard = styled(Grid)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: 'center',
  height: "auto",
  width: '300px',
  minHeight: '130px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  padding: "10px 15px",
  gap: "20px",
  border:
    theme.palette.mode === "dark"
      ? "none"
      : `1px solid ${theme.palette.primary.light}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)"
      : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0px 8px 10px 1px hsla(0,0%,0%,0.14), 0px 3px 14px 2px hsla(0,0%,0%,0.12), 0px 5px 5px -3px hsla(0,0%,0%,0.2)"
        : "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"
  }
}));