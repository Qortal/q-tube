import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { categories, subCategories } from '../../../../constants/Categories.ts';

interface CategorySelectProps {
  selectedCategory: any;
  selectedSubCategory: any;
  setSelectedCategory: (category: any) => void;
  setSelectedSubCategory: (subcategory: any) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  selectedSubCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  const { t } = useTranslation(['core', 'category']);

  const handleOptionCategoryChange = (event: SelectChangeEvent<string>) => {
    const optionId = event.target.value;
    const selectedOption = categories.find((option) => option.id === +optionId);
    setSelectedCategory(selectedOption || null);
  };

  const handleOptionSubCategoryChange = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      (option) => option.id === +optionId
    );
    setSelectedSubCategory(selectedOption || null);
  };

  return (
    <>
      <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
        <InputLabel id="Category">
          {t('core:publish.select_category', {
            postProcess: 'capitalizeFirstChar',
          })}
        </InputLabel>
        <Select
          labelId="Category"
          input={
            <OutlinedInput
              label={t('core:publish.select_category', {
                postProcess: 'capitalizeFirstChar',
              })}
            />
          }
          value={selectedCategory?.id || ''}
          onChange={handleOptionCategoryChange}
        >
          {categories.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {t(`category:categories.${option.id}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCategory && subCategories[selectedCategory?.id] && (
        <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
          <InputLabel id="Category">
            {t('core:publish.select_subcategory', {
              postProcess: 'capitalizeFirstChar',
            })}
          </InputLabel>
          <Select
            labelId="Sub-Category"
            input={
              <OutlinedInput
                label={t('core:publish.select_subcategory', {
                  postProcess: 'capitalizeFirstChar',
                })}
              />
            }
            value={selectedSubCategory?.id || ''}
            onChange={(e) =>
              handleOptionSubCategoryChange(
                e,
                subCategories[selectedCategory?.id]
              )
            }
          >
            {subCategories[selectedCategory.id].map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {t(`category:subcategories.${option.id}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};
