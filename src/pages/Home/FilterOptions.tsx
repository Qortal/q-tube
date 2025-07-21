import {
  Box,
  Chip,
  darken,
  Divider,
  ListItem,
  styled,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  Input,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useHomeState } from './Home-State';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  FiltersContainer,
  FiltersSubContainer,
} from './Components/VideoList-styles';
import { useSidebarState } from './Components/SearchSidebar-State';
import { categories, subCategories } from '../../constants/Categories';
import { useIsSmall } from '../../hooks/useIsSmall';
import { ListSuperLikeContainer } from '../../components/common/ListSuperLikes/ListSuperLikeContainer';

export const CustomChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.unSelected, // dark background
  color: theme.palette.text.primary, // white text
  borderRadius: '20px', // pill shape
  '.MuiChip-icon': {
    backgroundColor: '#555', // icon circle background
    borderRadius: '50%',
    padding: '4px',
    marginLeft: '4px',
    color: '#fff',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '&:hover': {
    backgroundColor: darken(theme.palette.background.unSelected, 0.3),
  },
}));

export const FilterOptions = () => {
  const isSmall = useIsSmall();
  const tabsRef = useRef(null);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const {
    tabValue,
    changeTab,
    filterName,
    filterCategory,
    filterType,
    filterMode,
    setFilterMode,
    setFilterCategory,
    setFilterType,
  } = useHomeState();

  const {
    filterName: filterNameState,
    setFilterName: setFilterNameState,
    onSearch,
    onReset,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    handleOptionSubCategoryChangeVideos,
    handleOptionCategoryChangeVideos,
  } = useSidebarState();

  const handleClick = (query) => {
    if (query?.filterMode) {
      setFilterMode(query.filterMode);
    }
    if (query?.filterCategory) {
      setFilterCategory({ id: query.filterCategory });
    } else {
      setFilterCategory('');
    }
  };

  const chipData = useMemo(() => {
    const hasCategory = !!filterCategory;
    return [
      {
        label: 'Most Recent',
        filterMode: 'recent',
        isSelected: !hasCategory && filterMode === 'recent',
        color:
          !hasCategory && filterMode === 'recent'
            ? 'primary.contrastText'
            : 'text.primary',
      },
      {
        label: 'All',
        filterMode: 'all',
        isSelected: !hasCategory && filterMode === 'all',
        color:
          !hasCategory && filterMode === 'all'
            ? 'primary.contrastText'
            : 'text.primary',
      },
      {
        label: 'Politics',
        filterMode: 'all',
        filterCategory: 9,
        isSelected: filterCategory?.id === 9,
        color:
          filterCategory?.id === 9 ? 'primary.contrastText' : 'text.primary',
      },
      {
        label: 'TV Shows',
        filterMode: 'all',
        filterCategory: 2,
        isSelected: filterCategory?.id === 2,
        color:
          filterCategory?.id === 2 ? 'primary.contrastText' : 'text.primary',
      },
      {
        label: 'Movies',
        filterMode: 'all',
        filterCategory: 1,
        isSelected: filterCategory?.id === 1,
        color:
          filterCategory?.id === 1 ? 'primary.contrastText' : 'text.primary',
      },
    ];
  }, [filterMode, filterCategory]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isSmall && (
        <Tabs
          ref={tabsRef}
          aria-label="basic tabs example"
          variant="scrollable" // Make tabs scrollable
          scrollButtons={true}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
            },
            width: `100%`, // Ensure the tabs container fits within the available space
            overflow: 'hidden', // Prevents overflow on small screens
            backgroundColor: theme.palette.background.paper,
            marginBottom: '5px',
          }}
        >
          <Tab
            // key={tab.tabId}
            label={
              <CustomChip
                icon={<AddIcon fontSize="small" />}
                label="More"
                clickable
                onClick={() => setIsOpen(true)}
                sx={(theme) => {
                  const baseColor =
                    filterName || filterCategory
                      ? theme.palette.primary.main
                      : theme.palette.background.unSelected;

                  return {
                    color:
                      filterName || filterCategory
                        ? 'primary.contrastText'
                        : 'text.primary',
                    fontWeight: 400,
                    backgroundColor: baseColor,
                    '&:hover': {
                      backgroundColor: darken(baseColor, 0.3), // 10% darker
                    },
                  };
                }}
              />
            } // Pass custom component
            sx={{
              '&.Mui-selected': {
                color: 'white',
              },
              padding: '0px 5px',

              margin: '0px',
              minWidth: '0px',
            }}
          />
          <Tab
            // key={tab.tabId}
            label={
              <CustomChip
                icon={<PlayCircleOutlineIcon fontSize="small" />}
                label="Videos"
                clickable
                onClick={() => setFilterType('videos')}
                sx={(theme) => {
                  const baseColor =
                    filterType === 'videos'
                      ? theme.palette.primary.main
                      : theme.palette.background.unSelected;

                  return {
                    color:
                      filterType === 'videos'
                        ? 'primary.contrastText'
                        : 'text.primary',
                    fontWeight: 400,
                    backgroundColor: baseColor,
                    '&:hover': {
                      backgroundColor: darken(baseColor, 0.3), // 10% darker
                    },
                  };
                }}
              />
            } // Pass custom component
            sx={{
              '&.Mui-selected': {
                color: 'white',
              },
              padding: '0px 5px',

              margin: '0px',
              minWidth: '0px',
            }}
          />
          <Tab
            // key={tab.tabId}
            label={
              <CustomChip
                icon={<PlaylistPlayIcon fontSize="small" />}
                label="Playlists"
                clickable
                onClick={() => setFilterType('playlists')}
                sx={(theme) => {
                  const baseColor =
                    filterType === 'playlists'
                      ? theme.palette.primary.main
                      : theme.palette.background.unSelected;

                  return {
                    color:
                      filterType === 'playlists'
                        ? 'primary.contrastText'
                        : 'text.primary',
                    fontWeight: 400,
                    backgroundColor: baseColor,
                    '&:hover': {
                      backgroundColor: darken(baseColor, 0.3), // 10% darker
                    },
                  };
                }}
              />
            } // Pass custom component
            sx={{
              '&.Mui-selected': {
                color: 'white',
              },
              padding: '0px 5px',
              margin: '0px',
              minWidth: '0px',
            }}
          />
          {chipData.map((data) => {
            return (
              <Tab
                key={data?.label}
                label={
                  <Chip
                    //   icon={icon}
                    label={data.label}
                    onClick={() => handleClick(data)}
                    sx={(theme) => {
                      const baseColor = data?.isSelected
                        ? theme.palette.primary.main
                        : theme.palette.background.unSelected;

                      return {
                        color: data.color,
                        fontWeight: 400,
                        backgroundColor: baseColor,
                        '&:hover': {
                          backgroundColor: darken(baseColor, 0.3), // 10% darker
                        },
                      };
                    }}
                  />
                } // Pass custom component
                sx={{
                  '&.Mui-selected': {
                    color: 'white',
                  },
                  padding: '0px 5px',
                  margin: '0px',
                  minWidth: '0px',
                }}
              />
            );
          })}
          {isSmall && (
            <Tab
              label={<ListSuperLikeContainer from="filters" />}
              sx={{
                '&.Mui-selected': {
                  color: 'white',
                },
                padding: '0px 5px',
                margin: '0px',
                minWidth: '0px',
              }}
            />
          )}
        </Tabs>
      )}
      {!isSmall && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            gap: '15px',
            p: 0.5,
            m: 0,
            marginBottom: '40px',
          }}
          component="ul"
        >
          <CustomChip
            icon={<PlayCircleOutlineIcon fontSize="small" />}
            label="Videos"
            clickable
            onClick={() => setFilterType('videos')}
            sx={(theme) => {
              const baseColor =
                filterType === 'videos'
                  ? theme.palette.primary.main
                  : theme.palette.background.unSelected;

              return {
                color:
                  filterType === 'videos'
                    ? 'primary.contrastText'
                    : 'text.primary',
                fontWeight: 400,
                backgroundColor: baseColor,
                '&:hover': {
                  backgroundColor: darken(baseColor, 0.3), // 10% darker
                },
              };
            }}
          />
          <CustomChip
            icon={<PlaylistPlayIcon fontSize="small" />}
            label="Playlists"
            clickable
            onClick={() => setFilterType('playlists')}
            sx={(theme) => {
              const baseColor =
                filterType === 'playlists'
                  ? theme.palette.primary.main
                  : theme.palette.background.unSelected;

              return {
                color:
                  filterType === 'playlists'
                    ? 'primary.contrastText'
                    : 'text.primary',
                fontWeight: 400,
                backgroundColor: baseColor,
                '&:hover': {
                  backgroundColor: darken(baseColor, 0.3), // 10% darker
                },
              };
            }}
          />
          <Divider
            flexItem
            orientation="vertical"
            sx={{
              color: 'primary.main',
            }}
          />

          {chipData.map((data) => {
            return (
              <ListItem
                key={data.label}
                sx={{
                  width: 'auto',
                  padding: '0px',
                }}
              >
                <Chip
                  //   icon={icon}
                  label={data.label}
                  onClick={() => handleClick(data)}
                  sx={(theme) => {
                    const baseColor = data?.isSelected
                      ? theme.palette.primary.main
                      : theme.palette.background.unSelected;

                    return {
                      color: data.color,
                      fontWeight: 400,
                      backgroundColor: baseColor,
                      '&:hover': {
                        backgroundColor: darken(baseColor, 0.3), // 10% darker
                      },
                    };
                  }}
                />
              </ListItem>
            );
          })}
          <CustomChip
            icon={<AddIcon fontSize="small" />}
            label="More Filters"
            clickable
            onClick={() => setIsOpen(true)}
            sx={(theme) => {
              const baseColor =
                filterName || filterCategory
                  ? theme.palette.primary.main
                  : theme.palette.background.unSelected;

              return {
                color:
                  filterName || filterCategory
                    ? 'primary.contrastText'
                    : 'text.primary',
                fontWeight: 400,
                backgroundColor: baseColor,
                '&:hover': {
                  backgroundColor: darken(baseColor, 0.3), // 10% darker
                },
              };
            }}
          />
          {/* <ListSuperLikeContainer /> */}
        </Box>
      )}

      <Dialog open={isOpen} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Filters</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            '::-webkit-scrollbar': {
              width: '16px',
              height: '10px',
            },

            '::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: '8px',
              backgroundClip: 'content-box',
              border: '4px solid transparent',
              transition: '0.3s background-color',
            },

            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <FiltersContainer>
              {/* <StatsData /> */}

              <Input
                id="standard-adornment-name"
                onChange={(e) => {
                  setFilterNameState(e.target.value);
                }}
                value={filterNameState}
                placeholder="User's Name (Exact)"
                sx={{
                  marginTop: '20px',
                  borderBottom: '1px solid',
                  '&&:before': {
                    borderBottom: 'none',
                  },
                  '&&:after': {
                    borderBottom: 'none',
                  },
                  '&&:hover:before': {
                    borderBottom: 'none',
                  },
                  '&&.Mui-focused:before': {
                    borderBottom: 'none',
                  },
                  '&&.Mui-focused': {
                    outline: 'none',
                  },
                  fontSize: '18px',
                }}
              />

              <FiltersSubContainer>
                <FormControl sx={{ width: '98%', marginTop: '30px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      flexDirection: 'column',
                    }}
                  >
                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                      <InputLabel
                        sx={{
                          fontSize: '16px',
                        }}
                        id="Category"
                      >
                        Category
                      </InputLabel>
                      <Select
                        labelId="Category"
                        input={<OutlinedInput label="Category" />}
                        value={selectedCategoryVideos?.id || ''}
                        onChange={handleOptionCategoryChangeVideos}
                        sx={{
                          // Target the input field
                          '.MuiSelect-select': {
                            fontSize: '16px', // Change font size for the selected value
                            padding: '10px 5px 15px 15px;',
                          },
                          // Target the dropdown icon
                          '.MuiSelect-icon': {
                            fontSize: '20px', // Adjust if needed
                          },
                          // Target the dropdown menu
                          '& .MuiMenu-paper': {
                            '.MuiMenuItem-root': {
                              fontSize: '14px', // Change font size for the menu items
                            },
                          },
                        }}
                      >
                        {categories.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedCategoryVideos &&
                      subCategories[selectedCategoryVideos?.id] && (
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                          <InputLabel
                            sx={{
                              fontSize: '16px',
                            }}
                            id="Sub-Category"
                          >
                            Sub-Category
                          </InputLabel>
                          <Select
                            labelId="Sub-Category"
                            input={<OutlinedInput label="Sub-Category" />}
                            value={selectedSubCategoryVideos?.id || ''}
                            onChange={(e) =>
                              handleOptionSubCategoryChangeVideos(
                                e,
                                subCategories[selectedCategoryVideos?.id]
                              )
                            }
                            sx={{
                              // Target the input field
                              '.MuiSelect-select': {
                                fontSize: '16px', // Change font size for the selected value
                                padding: '10px 5px 15px 15px;',
                              },
                              // Target the dropdown icon
                              '.MuiSelect-icon': {
                                fontSize: '20px', // Adjust if needed
                              },
                              // Target the dropdown menu
                              '& .MuiMenu-paper': {
                                '.MuiMenuItem-root': {
                                  fontSize: '14px', // Change font size for the menu items
                                },
                              },
                            }}
                          >
                            {subCategories[selectedCategoryVideos.id].map(
                              (option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      )}
                  </Box>
                </FormControl>
              </FiltersSubContainer>

              <Button
                onClick={() => {
                  onReset();
                }}
                sx={{
                  marginTop: '20px',
                  width: '80%',
                  alignSelf: 'center',
                }}
                variant="contained"
              >
                reset
              </Button>
              <Button
                onClick={() => {
                  onSearch();
                }}
                sx={{
                  marginTop: '20px',
                  width: '80%',
                  alignSelf: 'center',
                }}
                variant="contained"
              >
                Search
              </Button>
            </FiltersContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
