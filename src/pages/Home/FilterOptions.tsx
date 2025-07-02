import { Box, Chip, darken, Divider, ListItem, styled } from '@mui/material';
import React, { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useHomeState } from './Home-State';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AddIcon from '@mui/icons-material/Add';

const CustomChip = styled(Chip)(({ theme }) => ({
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
  const navigate = useNavigate();

  const {
    tabValue,
    changeTab,
    filterName,
    filterCategory,
    subscriptions,
    filterType,
    filterSearch,
    filterSubCategory,
    isHydrated,
    filterMode,
    setFilterMode,
    setFilterCategory,
    setFilterType,
  } = useHomeState();

  const handleClick = (query) => {
    if (query?.filterMode) {
      setFilterMode(query.filterMode);
    }
    if (query?.filterCategory) {
      console.log('filterCat');
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

  console.log('filterType', filterType);

  return (
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
              filterType === 'videos' ? 'primary.contrastText' : 'text.primary',
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
      />
    </Box>
  );
};
