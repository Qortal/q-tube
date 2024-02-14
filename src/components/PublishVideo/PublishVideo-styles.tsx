import { styled } from "@mui/system";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
  Select,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { TimesSVG } from "../../assets/svgs/TimesSVG";

export const DoubleLine = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

export const MainContainer = styled(Grid)({
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  margin: 0,
});

export const MainCol = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "20px",
}));

export const CreateContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  cursor: "pointer",
  background: theme.palette.background.default,
  width: "50px",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
}));

export const CodecTypography = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
}));
export const ModalBody = styled(Box)(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.background.default,
  borderRadius: "4px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  maxWidth: "900px",
  padding: "15px 35px",
  display: "flex",
  flexDirection: "column",
  gap: "17px",
  overflowY: "auto",
  maxHeight: "95vh",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)"
      : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper,
  },
  "&::-webkit-scrollbar-track:hover": {
    backgroundColor: theme.palette.background.paper,
  },
  "&::-webkit-scrollbar": {
    width: "16px",
    height: "10px",
    backgroundColor: theme.palette.mode === "light" ? "#f6f8fa" : "#292d3e",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light" ? "#d3d9e1" : "#575757",
    borderRadius: "8px",
    backgroundClip: "content-box",
    border: "4px solid transparent",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#b7bcc4" : "#474646",
  },
}));

export const NewCrowdfundTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontFamily: "Raleway",
  fontSize: "25px",
  userSelect: "none",
}));
export const NewCrowdFundFont = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontFamily: "Raleway",
  fontSize: "18px",
  userSelect: "none",
}));
export const NewCrowdfundTimeDescription = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontFamily: "Raleway",
  fontSize: "18px",
  userSelect: "none",
  fontStyle: "italic",
  textDecoration: "underline",
}));

export const CustomInputField = styled(TextField)(({ theme }) => ({
  fontFamily: "Mulish",
  fontSize: "19px",
  letterSpacing: "0px",
  fontWeight: 400,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.background.paper,
  "& label": {
    color: theme.palette.mode === "light" ? "#808183" : "#edeef0",
    fontFamily: "Mulish",
    fontSize: "19px",
    letterSpacing: "0px",
    fontWeight: 400,
  },
  "& label.Mui-focused": {
    color: theme.palette.mode === "light" ? "#A0AAB4" : "#d7d8da",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.mode === "light" ? "#B2BAC2" : "#c9cccf",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
  "& .MuiInputBase-root": {
    fontFamily: "Mulish",
    fontSize: "19px",
    letterSpacing: "0px",
    fontWeight: 400,
  },
  "& [class$='-MuiFilledInput-root']": {
    padding: "30px 12px 8px",
  },
  "& .MuiFilledInput-root:after": {
    borderBottomColor: theme.palette.secondary.main,
  },
}));

export const CrowdfundTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Copse",
  letterSpacing: "1px",
  fontWeight: 400,
  fontSize: "20px",
  color: theme.palette.text.primary,
  userSelect: "none",
  wordBreak: "break-word",
}));

export const CrowdfundSubTitleRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  flexDirection: "row",
});

export const CrowdfundSubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Copse",
  letterSpacing: "1px",
  fontWeight: 400,
  fontSize: "17px",
  color: theme.palette.text.primary,
  userSelect: "none",
  wordBreak: "break-word",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
  paddingBottom: "1.5px",
  width: "fit-content",
  textDecoration: "none",
}));

export const CrowdfundDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "Raleway",
  fontSize: "16px",
  color: theme.palette.text.primary,
  userSelect: "none",
  wordBreak: "break-word",
}));

export const Spacer = ({ height }: any) => {
  return (
    <Box
      sx={{
        height: height,
      }}
    />
  );
};

export const StyledCardHeaderComment = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "5px",
  padding: "7px 0px",
});
export const StyledCardCol = styled(Box)({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  gap: "2px",
  alignItems: "flex-start",
  width: "100%",
});

export const StyledCardColComment = styled(Box)({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  gap: "2px",
  alignItems: "flex-start",
  width: "100%",
});

export const AuthorTextComment = styled(Typography)({
  fontFamily: "Raleway, sans-serif",
  fontSize: "16px",
  lineHeight: "1.2",
});

export const AddLogoIcon = styled(AddPhotoAlternateIcon)(({ theme }) => ({
  color: "#fff",
  height: "25px",
  width: "auto",
}));

export const CoverImagePreview = styled("img")(({ theme }) => ({
  width: "100px",
  height: "100px",
  objectFit: "contain",
  userSelect: "none",
  borderRadius: "3px",
  marginBottom: "10px",
}));

export const LogoPreviewRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

export const TimesIcon = styled(TimesSVG)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "50%",
  padding: "5px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    scale: "1.1",
  },
}));

export const CrowdfundCardTitle = styled(DoubleLine)(({ theme }) => ({
  fontFamily: "Montserrat",
  fontSize: "24px",
  letterSpacing: "-0.3px",
  userSelect: "none",
  marginBottom: "auto",
  textAlign: "center",
  "@media (max-width: 650px)": {
    fontSize: "18px",
  },
}));

export const CrowdfundUploadDate = styled(Typography)(({ theme }) => ({
  fontFamily: "Montserrat",
  fontSize: "12px",
  letterSpacing: "0.2px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));

export const CATContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  padding: "15px",
  flexDirection: "column",
  gap: "20px",
  justifyContent: "center",
  width: "100%",
  alignItems: "center",
}));

export const AddCrowdFundButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textTransform: "none",
  padding: "10px 25px",
  fontSize: "15px",
  gap: "8px",
  color: "#ffffff",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.main : "#2a9a86",
  border: "none",
  borderRadius: "5px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.primary.dark : "#217e6d",
  },
}));

export const EditCrowdFundButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textTransform: "none",
  padding: "5px 12px",
  gap: "8px",
  color: "#ffffff",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.main : "#2a9a86",
  border: "none",
  borderRadius: "5px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.primary.dark : "#217e6d",
  },
}));

export const CrowdfundListWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "0px",
  background: theme.palette.background.default,
}));

export const CrowdfundTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "10px",
}));

export const CrowdfundPageTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Copse",
  fontSize: "35px",
  fontWeight: 400,
  letterSpacing: "1px",
  userSelect: "none",
  color: theme.palette.text.primary,
}));

export const CrowdfundStatusRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Mulish",
  fontSize: "21px",
  fontWeight: 400,
  letterSpacing: 0,
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: "8px",
  padding: "15px 25px",
  userSelect: "none",
}));

export const CrowdfundDescriptionRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  fontFamily: "Montserrat",
  fontSize: "18px",
  fontWeight: 400,
  letterSpacing: 0,
});

export const AboutMyCrowdfund = styled(Typography)(({ theme }) => ({
  fontFamily: "Copse",
  fontSize: "23px",
  fontWeight: 400,
  letterSpacing: "1px",
  userSelect: "none",
  color: theme.palette.text.primary,
}));

export const CrowdfundInlineContentRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const CrowdfundInlineContent = styled(Box)(({ theme }) => ({
  display: "flex",
  fontFamily: "Mulish",
  fontSize: "19px",
  fontWeight: 400,
  letterSpacing: 0,
  userSelect: "none",
  color: theme.palette.text.primary,
}));

export const CrowdfundAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  "& .Mui-expanded": {
    minHeight: "auto !important",
  },
}));

export const CrowdfundAccordionSummary = styled(AccordionSummary)({
  height: "50px",
  "& .Mui-expanded": {
    margin: "0px !important",
  },
});

export const CrowdfundAccordionFont = styled(Typography)(({ theme }) => ({
  fontFamily: "Mulish",
  fontSize: "20px",
  fontWeight: 400,
  letterSpacing: "0px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));

export const CrowdfundAccordionDetails = styled(AccordionDetails)({
  padding: "0px 16px 16px 16px",
});

export const AddCoverImageButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.2px",
  color: "white",
  gap: "5px",
}));

export const CoverImage = styled("img")({
  width: "100%",
  height: "250px",
  objectFit: "cover",
  objectPosition: "center",
});

export const CrowdfundActionButtonRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export const CrowdfundActionButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.2px",
  color: "white",
  gap: "5px",
}));

export const BackToHomeButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: "20px",
  left: "20px",
  display: "flex",
  alignItems: "center",
  fontFamily: "Montserrat",
  fontSize: "13px",
  fontWeight: 400,
  letterSpacing: "0.2px",
  color: "white",
  gap: "5px",
  padding: "5px 10px",
  backgroundColor: theme.palette.secondary.main,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    cursor: "pointer",
  },
}));

export const CrowdfundLoaderRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "10px",
});

export const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "1px 5px",
  borderRadius: "5px",
  backgroundColor: "transparent",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "#e4ddddac",
  },
});

export const StyledRating = styled(Rating)({
  fontSize: "28px",
});

export const NoReviewsFont = styled(Typography)(({ theme }) => ({
  fontFamily: "Mulish",
  fontWeight: 400,
  letterSpacing: 0,
  color: theme.palette.text.primary,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const CustomSelect = styled(Select)(({ theme }) => ({
  fontFamily: "Mulish",
  fontSize: "19px",
  letterSpacing: "0px",
  fontWeight: 400,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  "& .MuiSelect-select": {
    padding: "12px",
    fontFamily: "Mulish",
    fontSize: "19px",
    letterSpacing: "0px",
    fontWeight: 400,
    borderRadius: theme.shape.borderRadius, // Match border radius
  },
  "&:before": {
    // Underline style
    borderBottomColor: theme.palette.mode === "light" ? "#B2BAC2" : "#c9cccf",
  },
  "&:after": {
    // Underline style when focused
    borderBottomColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
  "& .MuiInputBase-root": {
    fontFamily: "Mulish",
    fontSize: "19px",
    letterSpacing: "0px",
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
}));
