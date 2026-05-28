import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  removeTrailingZeros,
  setNumberWithinBounds,
} from '../../../utils/numberFunctions.ts';

type eventType = React.ChangeEvent<HTMLInputElement>;
type BoundedNumericTextFieldProps = {
  minValue: number;
  maxValue: number;
  addIconButtons?: boolean;
  allowDecimals?: boolean;
  allowNegatives?: boolean;
  afterChange?: (s: string) => void;
  initialValue?: string;
  maxSigDigits?: number;
} & TextFieldProps;

export const BoundedNumericTextfield = ({
  minValue,
  maxValue,
  addIconButtons = true,
  allowDecimals = true,
  allowNegatives = false,
  afterChange,
  initialValue,
  maxSigDigits = 6,
  ...props
}: BoundedNumericTextFieldProps) => {
  const [textFieldValue, setTextFieldValue] = useState<string>(
    initialValue || ''
  );
  const ref = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stringIsEmpty = (value: string) => {
    return value === '';
  };
  const isAllZerosNum = /^0*\.?0*$/;
  const isFloatNum = /^-?[0-9]*\.?[0-9]*$/;
  const isIntegerNum = /^-?[0-9]+$/;
  const skipMinMaxCheck = (value: string) => {
    const lastIndexIsDecimal = value.charAt(value.length - 1) === '.';
    const isEmpty = stringIsEmpty(value);
    const isAllZeros = isAllZerosNum.test(value);
    const isInteger = isIntegerNum.test(value);
    // skipping minMax on all 0s allows values less than 1 to be entered

    return lastIndexIsDecimal || isEmpty || (isAllZeros && !isInteger);
  };

  const setMinMaxValue = (value: string): string => {
    if (skipMinMaxCheck(value)) return value;
    const valueNum = Number(value);

    const boundedNum = setNumberWithinBounds(valueNum, minValue, maxValue);

    const numberInBounds = boundedNum === valueNum;
    return numberInBounds ? value : boundedNum.toString();
  };

  const getSigDigits = (number: string) => {
    if (isIntegerNum.test(number)) return 0;
    const decimalSplit = number.split('.');
    return decimalSplit[decimalSplit.length - 1].length;
  };

  const sigDigitsExceeded = (number: string, sigDigits: number) => {
    return getSigDigits(number) > sigDigits;
  };

  const filterTypes = (value: string) => {
    if (allowDecimals === false) value = value.replace('.', '');
    if (allowNegatives === false) value = value.replace('-', '');
    if (sigDigitsExceeded(value, maxSigDigits)) {
      value = value.substring(0, value.length - 1);
    }
    return value;
  };
  const filterValue = (value: string) => {
    if (stringIsEmpty(value)) return '';
    value = filterTypes(value);
    if (isFloatNum.test(value)) {
      return setMinMaxValue(value);
    }
    return textFieldValue;
  };

  const listeners = (e: eventType) => {
    const newValue = filterValue(e.target.value);
    setTextFieldValue(newValue);
    if (afterChange) afterChange(newValue);
  };

  const changeValueWithIncDecButton = useCallback(
    (changeAmount: number) => {
      setTextFieldValue((currentValue) => {
        const changedValue = (+currentValue + changeAmount).toString();
        const inBoundsValue = setMinMaxValue(changedValue);
        if (afterChange) afterChange(inBoundsValue);
        return inBoundsValue;
      });
    },
    [afterChange]
  );

  const startContinuousChange = useCallback(
    (changeAmount: number) => {
      // Change immediately on first click
      changeValueWithIncDecButton(changeAmount);

      // Then start interval for continuous changes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        changeValueWithIncDecButton(changeAmount);
      }, 200); // 5 times per second
    },
    [changeValueWithIncDecButton]
  );

  const stopContinuousChange = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatValueOnBlur = (e: eventType) => {
    let value = e.target.value;
    if (stringIsEmpty(value) || value === '.') {
      setTextFieldValue('');
      return;
    }

    value = setMinMaxValue(value);
    value = removeTrailingZeros(value);
    if (isAllZerosNum.test(value)) value = minValue.toString();

    setTextFieldValue(value);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange, ...noChangeProps } = { ...props };
  return (
    <TextField
      {...noChangeProps}
      InputProps={{
        ...props?.InputProps,
        endAdornment: addIconButtons ? (
          <InputAdornment position="end">
            <IconButton
              onMouseDown={() => startContinuousChange(1)}
              onMouseUp={stopContinuousChange}
              onMouseLeave={stopContinuousChange}
              onTouchStart={() => startContinuousChange(1)}
              onTouchEnd={stopContinuousChange}
            >
              <AddIcon />{' '}
            </IconButton>
            <IconButton
              onMouseDown={() => startContinuousChange(-1)}
              onMouseUp={stopContinuousChange}
              onMouseLeave={stopContinuousChange}
              onTouchStart={() => startContinuousChange(-1)}
              onTouchEnd={stopContinuousChange}
            >
              <RemoveIcon />{' '}
            </IconButton>
          </InputAdornment>
        ) : (
          <></>
        ),
      }}
      onChange={(e) => listeners(e as eventType)}
      onBlur={(e) => {
        formatValueOnBlur(e as eventType);
      }}
      autoComplete="off"
      value={textFieldValue}
      inputRef={ref}
    />
  );
};

export default BoundedNumericTextfield;
