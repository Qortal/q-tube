import { Chip } from '@mui/material';

export const CustomChip = ({ label, ...props }) => {
  return <Chip label={label} {...props} />;
};
