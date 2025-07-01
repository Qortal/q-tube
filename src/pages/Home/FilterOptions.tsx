import { Box, Chip, darken, ListItem } from '@mui/material';
import React, { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useHomeState } from './Home-State';

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
        label: 'Most recent',
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
    </Box>
  );
};
