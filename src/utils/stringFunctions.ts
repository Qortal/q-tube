export const getFileExtensionIndex = (s: string) => {
  const lastIndex = s.lastIndexOf(".");
  return lastIndex > 0 ? lastIndex : s.length - 1;
};

export const getFileName = (s: string) => {
  return s.substring(0, getFileExtensionIndex(s));
};
