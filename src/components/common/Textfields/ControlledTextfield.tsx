import { styled, SxProps, TextField, TextFieldProps } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { fontSizeMedium } from '../../../constants/Misc.ts';

const CustomInputField = styled(TextField)(({ theme }) => ({
  fontFamily: 'Mulish',
  fontSize: fontSizeMedium,
  letterSpacing: '0px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.background.paper,
}));

export type ControlledTextFieldProps = {
  setValue: Dispatch<SetStateAction<string>>;
  inputProps?: SxProps;
  required?: boolean;
} & TextFieldProps;

export const ControlledTextField = ({
  setValue,
  value,
  inputProps,
  required = true,
  ...props
}: ControlledTextFieldProps) => {
  return (
    <CustomInputField
      variant="filled"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      slotProps={{ htmlInput: { input: { maxLength: 180, ...inputProps } } }}
      required={required}
      sx={{ width: 450 }}
      {...props}
    />
  );
};
