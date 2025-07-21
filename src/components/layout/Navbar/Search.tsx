import {
  Box,
  ButtonBase,
  ClickAwayListener,
  IconButton,
  InputBase,
  Portal,
  styled,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState } from 'react';
import { useSidebarState } from '../../../pages/Home/Components/SearchSidebar-State';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import ClearAllIcon from '@mui/icons-material/ClearAll';
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

  height: '40px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
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
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
  },
  padding: '8px 12px',
}));

export const Search = () => {
  const isSmall = useIsSmall();
  const navigate = useNavigate();
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<DOMRect | null>(null);

  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filterMode, setFilterMode, isHydratedFilterMode] = usePersistedState(
    'filterMode',
    'recent'
  );
  const [searchHistory, setSearchHistory] = usePersistedState(
    'search-history-v1',
    []
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
      if (filterSearch) {
        setSearchHistory((prev) => {
          const filtered = prev.filter((term) => term !== filterSearch);
          return [filterSearch, ...filtered].slice(0, 200);
        });
      }
      onSearch();
      if (isHydratedFilterMode) setFilterMode('all');
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

  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => {
      setShowPopover(true);
    }, 200);
    if (searchWrapperRef.current) {
      const rect = searchWrapperRef.current.getBoundingClientRect();
      setPopoverPosition(rect);
    }
  };

  const handleClickAway = (event: MouseEvent) => {
    const target = event.target as Node;
    if (!searchWrapperRef.current?.contains(target)) {
      setShowPopover(false);
    }
  };

  const renderPopover = () => {
    if (
      !showPopover ||
      filterSearch ||
      !popoverPosition ||
      searchHistory.length === 0
    )
      return null;

    return (
      <Portal container={document.getElementById('dropdown-portal-root')}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: popoverPosition.bottom + window.scrollY,
            left: popoverPosition.left + window.scrollX,
            width: popoverPosition.width,
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              width: '100%',
              zIndex: 1500,
              maxHeight: 300,
              overflowY: 'auto',
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              boxShadow: 3,
              '::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },

              '::-webkit-scrollbar': {
                width: '16px',
                height: '10px',
              },

              '::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(63, 67, 80, 0.24)',
                borderRadius: '8px',
                backgroundClip: 'content-box',
                border: '4px solid transparent',
                transition: '0.3s background-color',
              },
              '::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(63, 67, 80, 0.50)',
              },
            }}
          >
            <Box
              onClick={() => {
                setSearchHistory([]);
                setShowPopover(false);
              }}
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
            >
              <ClearAllIcon fontSize="small" />
              Clear search history
            </Box>
            {searchHistory.map((term, index) => (
              <Box
                key={index}
                onClick={() => {
                  setFilterSearch(term);
                  setShowPopover(false);
                  if (isHydratedFilterMode) setFilterMode('all');
                  navigate(`/`);

                  onSearch(term);
                }}
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  wordBreak: 'break-word',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                }}
              >
                <HistoryIcon fontSize="small" />
                {term}
              </Box>
            ))}
          </Box>
        </motion.div>
      </Portal>
    );
  };

  return (
    <>
      {isSmall ? (
        <>
          <ButtonBase
            onClick={() => {
              setIsOpenSearch(true);
              setTimeout(() => inputRef.current?.focus(), 250);
            }}
          >
            <SearchIcon
              sx={{ fontSize: '35px', color: theme.palette.action.active }}
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
                  flexDirection: 'column',
                  zIndex: 1001,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: isFocused ? 0 : 'unset',
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
                    width: '100%',
                  }}
                >
                  <ButtonBase
                    onClick={() => {
                      if (isFocused) {
                        setIsFocused(false);
                        if (filterSearchGlobal) {
                          setFilterSearch(filterSearchGlobal);
                        } else {
                          setIsOpenSearch(false);
                          setFilterSearch('');
                        }
                        return;
                      }
                      setIsOpenSearch(false);
                      setFilterSearchGlobal('');
                      setFilterSearch('');
                    }}
                  >
                    <ArrowBackIcon
                      sx={{
                        color: theme.palette.action.active,
                        fontSize: '30px',
                      }}
                    />
                  </ButtonBase>
                  <StyledInputBase
                    inputRef={inputRef}
                    placeholder="Search…"
                    inputProps={{
                      'aria-label': 'search',
                      enterKeyHint: 'search',
                      inputMode: 'text',
                    }}
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleFocus}
                    sx={{
                      height: '100%',
                      '& .MuiInputBase-input': {
                        padding: '0px',
                        height: '100%',
                      },
                    }}
                  />
                  <SearchIconWrapper>
                    <ButtonBase
                      onClick={() => {
                        setFilterSearch('');

                        inputRef?.current?.focus();
                      }}
                      sx={{ visibility: filterSearch ? 'visible' : 'hidden' }}
                    >
                      <CloseIcon
                        sx={{
                          color: theme.palette.action.active,
                          fontSize: '30px',
                        }}
                      />
                    </ButtonBase>
                  </SearchIconWrapper>
                </SearchParent>
                {searchHistory?.length > 0 && isFocused && (
                  <Box
                    sx={{
                      width: '100%',
                      flexGrow: 1,
                      overflowY: 'auto',
                      bgcolor: 'background.paper',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 3,
                      '::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                      },

                      '::-webkit-scrollbar': {
                        width: '16px',
                        height: '10px',
                      },

                      '::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(63, 67, 80, 0.24)',
                        borderRadius: '8px',
                        backgroundClip: 'content-box',
                        border: '4px solid transparent',
                        transition: '0.3s background-color',
                      },
                      '::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'rgba(63, 67, 80, 0.50)',
                      },
                    }}
                  >
                    <Box
                      onClick={() => {
                        setSearchHistory([]);
                        setShowPopover(false);
                      }}
                      sx={{
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                      }}
                    >
                      <ClearAllIcon fontSize="small" />
                      Clear search history
                    </Box>
                    {searchHistory.map((term, index) => (
                      <Box
                        key={index}
                        onClick={() => {
                          setFilterSearch(term);
                          setShowPopover(false);
                          if (isHydratedFilterMode) setFilterMode('all');
                          navigate(`/`);

                          onSearch(term);
                          setIsFocused(false);
                        }}
                        sx={{
                          px: 2,
                          py: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          wordBreak: 'break-word',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                        }}
                      >
                        <HistoryIcon fontSize="small" />
                        {term}
                      </Box>
                    ))}
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: 'relative' }}>
            <SearchParent ref={searchWrapperRef}>
              <StyledInputBase
                inputRef={inputRef}
                size="small"
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleFocus}
              />
              <SearchIconWrapper>
                <ButtonBase
                  onClick={() => {
                    setFilterSearchGlobal('');
                    setFilterSearch('');
                    inputRef?.current?.focus();
                  }}
                  sx={{ visibility: filterSearchGlobal ? 'visible' : 'hidden' }}
                >
                  <CloseIcon sx={{ color: theme.palette.action.active }} />
                </ButtonBase>
                <ButtonBase
                  sx={{ height: '100%' }}
                  onClick={() => {
                    onSearch();
                    if (isHydratedFilterMode) setFilterMode('all');
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
                    <SearchIcon sx={{ color: 'background.paper2' }} />
                  </Box>
                </ButtonBase>
              </SearchIconWrapper>
            </SearchParent>
            {renderPopover()}
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};
