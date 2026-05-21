import { styled } from '@mui/system';
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
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { TimesSVG } from '../../../assets/svgs/TimesSVG.tsx';

export const DoubleLine = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

export const MainContainer = styled(Grid)({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  margin: 0,
});

export const MainCol = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: '20px',
}));

export const CreateContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  cursor: 'pointer',
  background: theme.palette.background.default,
  width: '50px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
}));

export const ModalBody = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.default,
  borderRadius: '4px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  maxWidth: '900px',
  padding: '15px 35px',
  display: 'flex',
  flexDirection: 'column',
  gap: '17px',
  overflowY: 'auto',
  maxHeight: '95vh',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)'
      : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-track:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar': {
    width: '16px',
    height: '10px',
    backgroundColor: theme.palette.mode === 'light' ? '#f6f8fa' : '#292d3e',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'light' ? '#d3d9e1' : '#575757',
    borderRadius: '8px',
    backgroundClip: 'content-box',
    border: '4px solid transparent',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#b7bcc4' : '#474646',
  },
}));

export const NewCrowdfundTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '25px',
}));

export const CustomInputField = styled(TextField)(({ theme }) => ({
  fontSize: '19px',
  letterSpacing: '0px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.background.paper,
  '& label': {
    color: theme.palette.mode === 'light' ? '#808183' : '#edeef0',
    fontSize: '19px',
    letterSpacing: '0px',
    fontWeight: 400,
  },
  '& label.Mui-focused': {
    color: theme.palette.mode === 'light' ? '#A0AAB4' : '#d7d8da',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.mode === 'light' ? '#B2BAC2' : '#c9cccf',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
  '& .MuiInputBase-root': {
    fontSize: '19px',
    letterSpacing: '0px',
    fontWeight: 400,
  },
  "& [class$='-MuiFilledInput-root']": {
    padding: '30px 12px 8px',
  },
  '& .MuiFilledInput-root:after': {
    borderBottomColor: theme.palette.secondary.main,
  },
}));

export const CrowdfundSubTitleRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'row',
});

export const CrowdfundSubTitle = styled(Typography)(({ theme }) => ({
  letterSpacing: '1px',
  fontWeight: 400,
  fontSize: '17px',
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
  borderBottom: `1px solid ${theme.palette.text.primary}`,
  paddingBottom: '1.5px',
  width: 'fit-content',
  textDecoration: 'none',
}));

export const AddLogoIcon = styled(AddPhotoAlternateIcon)(({ theme }) => ({
  color: '#fff',
  height: '25px',
  width: 'auto',
}));

export const CoverImagePreview = styled('img')(({ theme }) => ({
  width: '100px',
  height: '100px',
  objectFit: 'contain',
  userSelect: 'none',
  borderRadius: '3px',
  marginBottom: '10px',
}));

export const LogoPreviewRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));

export const TimesIcon = styled(TimesSVG)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '50%',
  padding: '5px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    scale: '1.1',
  },
}));

export const AddCoverImageButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '0.2px',
  color: 'white',
  gap: '5px',
}));

export const CrowdfundActionButtonRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const CrowdfundActionButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '0.2px',
  color: 'white',
  gap: '5px',
}));
