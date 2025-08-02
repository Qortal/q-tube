export const getFileExtensionIndex = (s: string) => {
  const lastIndex = s.lastIndexOf('.');
  return lastIndex > 0 ? lastIndex : s.length - 1;
};

export const getFileExtension = (file: File) => {
  const index = getFileExtensionIndex(file.name) + 1;
  return file.name.toLowerCase().trim().substring(index);
};

export const getFileName = (s: string) => {
  return s.substring(0, getFileExtensionIndex(s));
};
