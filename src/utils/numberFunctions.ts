

export const truncateNumber = (value: string | number, sigDigits: number) => {
  return Number(value).toFixed(sigDigits);
};

export const removeTrailingZeros = (s: string) => {
  return Number(s).toString();
};

export const setNumberWithinBounds = (
  num: number,
  minValue: number,
  maxValue: number
) => {
  if (num > maxValue) return maxValue;
  if (num < minValue) return minValue;
  return num;
};

export const numberToInt = (num: number) => {
  return Math.floor(num);
};
