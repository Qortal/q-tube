import { styled } from "@mui/system";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  TextField,
  InputLabel,
  Autocomplete,
  Radio,
} from "@mui/material";

export const VideoContainer = styled(Grid)(({ theme }) => ({
  position: "relative",
  display: "flex",
  padding: "15px",
  flexDirection: "row",
  gap: "20px",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  width: "100%",
}));

// export const VideoCardContainer = styled(Grid)({
//   display: "flex",
//   flexWrap: "wrap",
//   padding: "5px 35px 15px 35px",
// });

// export const VideoCardCol = styled(Grid)(({ theme }) => ({
//   display: "flex",
//   gap: 1,
//   alignItems: "center",
//   width: "auto",
//   position: "relative",
//   maxWidth: "100%",
//   flexGrow: 1,
//   [theme.breakpoints.down("sm")]: {
//     width: "100%",
//   },
// }));

export const VideoCardContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: theme.spacing(2),
  padding: "10px",
  width: "100%",
}));

export const VideoCardCol = styled("div")({
  position: "relative",
  minWidth: "250px", // Minimum width of each item
  maxWidth: "1fr", // Maximum width, allowing the item to fill the column
  // ... other styles
});

export const StoresRow = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "15px",
  width: "auto",
  position: "relative",
  "@media (max-width: 450px)": {
    width: "100%",
  },
}));

export const VideoCard = styled(Grid)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: "320px",
  // width: '300px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  padding: "10px 15px",
  gap: "20px",
  cursor: "pointer",
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
    boxShadow:
      theme.palette.mode === "dark"
        ? "0px 8px 10px 1px hsla(0,0%,0%,0.14), 0px 3px 14px 2px hsla(0,0%,0%,0.12), 0px 5px 5px -3px hsla(0,0%,0%,0.2)"
        : "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;",
  },
}));

export const StoreCardInfo = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "5px",
  marginTop: "15px",
}));

export const VideoImageContainer = styled(Grid)(({ theme }) => ({}));

export const VideoCardImage = styled("img")(({ theme }) => ({
  maxWidth: "300px",
  minWidth: "150px",
  borderRadius: "5px",
  height: "150px",
  objectFit: "fill",
  width: "266px",
}));

const DoubleLine = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export const VideoCardTitle = styled(DoubleLine)(({ theme }) => ({
  fontFamily: "Cairo",
  fontSize: "16px",
  letterSpacing: "0.4px",
  color: theme.palette.text.primary,
  userSelect: "none",
  marginBottom: "auto",
}));
export const VideoCardName = styled(Typography)(({ theme }) => ({
  fontFamily: "Cairo",
  fontSize: "16px",
  letterSpacing: "0.4px",
  color: theme.palette.text.primary,
  userSelect: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));
export const VideoUploadDate = styled(Typography)(({ theme }) => ({
  fontFamily: "Cairo",
  fontSize: "18px",
  letterSpacing: "0.4px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));
export const BottomParent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
}));
export const VideoCardDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "Karla",
  fontSize: "20px",
  letterSpacing: "0px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));

export const StoreCardOwner = styled(Typography)(({ theme }) => ({
  fontFamily: "Livvic",
  color: theme.palette.text.primary,
  fontSize: "17px",
  position: "absolute",
  bottom: "5px",
  right: "10px",
  userSelect: "none",
}));

export const StoreCardYouOwn = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "5px",
  right: "10px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontFamily: "Livvic",
  fontSize: "15px",
  color: theme.palette.text.primary,
}));

export const MyStoresRow = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  padding: "5px",
  width: "100%",
}));

export const NameContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  marginBottom: "2px",
}));

export const MyStoresCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "auto",
  borderRadius: "4px",
  backgroundColor: theme.palette.background.paper,
  padding: "5px 10px",
  fontFamily: "Raleway",
  fontSize: "18px",
  color: theme.palette.text.primary,
}));

export const MyStoresCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#c0d4ff",
  "&.Mui-checked": {
    color: "#6596ff",
  },
}));

export const ProductManagerRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  justifyContent: "flex-end",
  width: "100%",
}));

export const FiltersCol = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "20px 15px",
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.background.paper}`,
  borderRight: `1px solid ${theme.palette.background.paper}`,
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

export const FiltersRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "0 15px",
  fontSize: "16px",
  userSelect: "none",
}));

export const FiltersTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  margin: "20px 0",
  fontFamily: "Raleway",
  fontSize: "17px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));

export const FiltersCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#c0d4ff",
  "&.Mui-checked": {
    color: "#6596ff",
  },
}));

export const FiltersRadioButton = styled(Radio)(({ theme }) => ({
  color: "#c0d4ff",
  "&.Mui-checked": {
    color: "#6596ff",
  },
}));

export const FilterSelect = styled(Autocomplete)(({ theme }) => ({
  "& #categories-select": {
    padding: "7px",
  },
  "& .MuiSelect-placeholder": {
    fontFamily: "Raleway",
    fontSize: "17px",
    color: theme.palette.text.primary,
    userSelect: "none",
  },
  "& MuiFormLabel-root": {
    fontFamily: "Raleway",
    fontSize: "17px",
    color: theme.palette.text.primary,
    userSelect: "none",
  },
}));

export const FilterSelectMenuItems = styled(TextField)(({ theme }) => ({
  fontFamily: "Raleway",
  fontSize: "17px",
  color: theme.palette.text.primary,
  userSelect: "none",
}));

export const FiltersSubContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  gap: "5px",
}));

export const FilterDropdownLabel = styled(InputLabel)(({ theme }) => ({
  fontFamily: "Raleway",
  fontSize: "16px",
  color: theme.palette.text.primary,
}));

export const IconsBox = styled(Box)({
  display: "flex",
  gap: "3px",
  position: "absolute",
  top: "12px",
  right: "5px",
  transition: "all 0.3s ease-in-out",
});

export const BlockIconContainer = styled(Box)({
  display: "flex",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
  backgroundColor: "#fbfbfb",
  color: "#c25252",
  padding: "5px",
  borderRadius: "3px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    transform: "scale(1.1)",
  },
});
