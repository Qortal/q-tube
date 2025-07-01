import { styled } from '@mui/system';
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  TextField,
  InputLabel,
  Autocomplete,
  Radio,
} from '@mui/material';
import { fontSizeMedium, fontSizeSmall } from '../../../constants/Misc.ts';

export const VideoContainer = styled(Grid)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  padding: '15px',
  flexDirection: 'row',
  gap: '20px',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  width: '100%',
}));

export const VideoCardContainer = styled('div')(({ theme }) => ({
  width: '100%',
}));

export const VideoCardCol = styled('div')({
  width: '320px', // Minimum width of each item
  maxWidth: '320px',
  position: 'relative',
});

export const VideoCard = styled(Grid)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  // height: '320px',
  // width: '300px',
  // backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  // padding: '10px 15px',
  gap: '20px',
  cursor: 'pointer',
  // border:
  //   theme.palette.mode === 'dark'
  //     ? 'none'
  //     : `1px solid ${theme.palette.primary.light}`,
  // boxShadow:
  //   theme.palette.mode === 'dark'
  //     ? '0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)'
  //     : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  // transition: 'all 0.3s ease-in-out',
  // '&:hover': {
  //   boxShadow:
  //     theme.palette.mode === 'dark'
  //       ? '0px 8px 10px 1px hsla(0,0%,0%,0.14), 0px 3px 14px 2px hsla(0,0%,0%,0.12), 0px 5px 5px -3px hsla(0,0%,0%,0.2)'
  //       : 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;',
  // },
}));

const DoubleLine = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export const VideoCardTitle = styled(DoubleLine)(({ theme }) => ({
  letterSpacing: '0.4px',
  color: theme.palette.text.primary,
  userSelect: 'none',
  marginBottom: 'auto',
}));
export const VideoCardName = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  letterSpacing: '0.4px',
  color: theme.palette.text.primary,
  userSelect: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));
export const VideoUploadDate = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  letterSpacing: '0.4px',
  color: theme.palette.text.secondary,
  userSelect: 'none',
}));
export const BottomParent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
}));

export const NameContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '2px',
  width: '100%',
}));

export const VideoManagerRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
}));

export const FiltersCol = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '20px 15px',
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.background.paper}`,
  borderRight: `1px solid ${theme.palette.background.paper}`,
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const FiltersRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontSize: fontSizeSmall,
  userSelect: 'none',
}));

export const FiltersCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#c0d4ff',
  '&.Mui-checked': {
    color: '#6596ff',
  },
}));

export const FiltersRadioButton = styled(Radio)(({ theme }) => ({
  color: '#c0d4ff',
  '&.Mui-checked': {
    color: '#6596ff',
  },
}));

export const FiltersSubContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  flexDirection: 'column',
  gap: '5px',
}));

export const FilterDropdownLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
}));

export const IconsBox = styled(Box)({
  display: 'flex',
  gap: '3px',
  position: 'absolute',
  top: '12px',
  right: '5px',
  transition: 'all 0.3s ease-in-out',
});

export const BlockIconContainer = styled(Box)({
  display: 'flex',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
  backgroundColor: '#fbfbfb',
  color: '#c25252',
  padding: '5px',
  borderRadius: '3px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.1)',
  },
});
