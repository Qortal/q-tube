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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState } from 'react';
import { useSidebarState } from '../../../pages/Home/Components/SearchSidebar-State';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { usePersistedState } from '../../../state/persist/persist';
import { useIsSmall } from '../../../hooks/useIsSmall';
import { AnimatePresence, motion } from 'framer-motion';
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
  const isSmall = useIsSmall();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filterMode, setFilterMode, isHydratedFilterMode] = usePersistedState(
    'filterMode',
    'recent'
  );
  const inputRef = useRef();
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
      // setIsOpenSearch(false);
      navigate(`/`);
      setIsFocused(false);
      inputRef?.current?.blur();
    }
  };

  useEffect(() => {
    if (filterSearchGlobal && isSmall) {
      setIsOpenSearch(true);
    }
  }, [filterSearchGlobal, isSmall]);

  return (
    <>
      {isSmall && (
        <>
          <ButtonBase
            onClick={() => {
              setIsOpenSearch(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 250);
            }}
          >
            <SearchIcon
              sx={{
                fontSize: '35px',
                color: theme.palette.action.active,
              }}
            />
          </ButtonBase>
          <AnimatePresence>
            {isOpenSearch && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  position: 'fixed',
                  zIndex: 1001,
                  top: '0px',
                  left: '0px',
                  right: '0px',
                  bottom: isFocused ? '0px' : 'unset',
                  height: isFocused ? 'unset' : '65px',
                  backgroundColor: theme.palette.background.paper2,
                }}
              >
                <SearchParent
                  sx={{
                    outline: 'none',
                    borderBottom: isFocused
                      ? `1px ${theme.palette.action.active} solid`
                      : 'unset',
                    borderRadius: '0px',
                    height: '65px',
                    padding: '3px',
                  }}
                >
                  <ButtonBase
                    onClick={() => {
                      if (isFocused) {
                        setIsFocused(false);
                        if (filterSearchGlobal) {
                          setFilterSearch(filterSearchGlobal);
                        }
                        if (!filterSearchGlobal) {
                          setIsOpenSearch(false);
                          setFilterSearch('');
                        }
                        return;
                      }
                      setIsOpenSearch(false);
                      setFilterSearchGlobal('');
                      setFilterSearch('');
                    }}
                    // sx={{
                    //   visibility: filterSearchGlobal ? 'visible' : 'hidden',
                    // }}
                  >
                    <ArrowBackIcon
                      sx={{
                        color: theme.palette.action.active,
                      }}
                    />
                  </ButtonBase>
                  <StyledInputBase
                    inputRef={inputRef}
                    // autoFocus
                    size="small"
                    placeholder="Search…"
                    inputProps={{
                      'aria-label': 'search',
                      enterKeyHint: 'search',
                      inputMode: 'text',
                    }}
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onFocus={() => setIsFocused(true)}
                  />
                  <SearchIconWrapper>
                    <ButtonBase
                      onClick={() => {
                        // setFilterSearchGlobal('');
                        setFilterSearch('');
                        inputRef?.current?.focus();
                      }}
                      sx={{
                        visibility: filterSearch ? 'visible' : 'hidden',
                      }}
                    >
                      <CloseIcon
                        sx={{
                          color: theme.palette.action.active,
                        }}
                      />
                    </ButtonBase>
                  </SearchIconWrapper>
                </SearchParent>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      {!isSmall && (
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
      )}
    </>
  );
};
