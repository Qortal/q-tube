import {
  Box,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  styled,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useSidebarState } from '../../../pages/Home/Components/SearchSidebar-State';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { usePersistedState } from '../../../state/persist/persist';
const SearchParent = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  marginLeft: 0,
  width: '100%',
  outline: `1px ${theme.palette.action.active} solid`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  height: '40px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  // height: '100%',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  height: '100%',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
    },
  },
  padding: '8px 12px',
}));

export const Search = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [filterMode, setFilterMode, isHydratedFilterMode] = usePersistedState(
    'filterMode',
    'recent'
  );
  const {
    filterSearch,
    setFilterSearch,
    filterSearchGlobal,
    setFilterSearchGlobal,
    onSearch,
  } = useSidebarState();

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearch();
      if (isHydratedFilterMode) {
        setFilterMode('all');
      }
      navigate(`/`);
    }
  };

  return (
    <>
      <SearchParent>
        <StyledInputBase
          size="small"
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <SearchIconWrapper>
          <ButtonBase
            onClick={() => {
              setFilterSearchGlobal('');
              setFilterSearch('');
            }}
            sx={{
              visibility: filterSearchGlobal ? 'visible' : 'hidden',
            }}
          >
            <CloseIcon
              sx={{
                color: theme.palette.action.active,
              }}
            />
          </ButtonBase>
          <ButtonBase
            sx={{
              height: '100%',
            }}
            onClick={() => {
              onSearch();
              if (isHydratedFilterMode) {
                setFilterMode('all');
              }
              navigate(`/`);
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'primary.main',
                width: '40px',
              }}
            >
              <SearchIcon
                sx={{
                  color: 'background.paper2',
                }}
              />
            </Box>
          </ButtonBase>
        </SearchIconWrapper>
      </SearchParent>
    </>
  );
};
