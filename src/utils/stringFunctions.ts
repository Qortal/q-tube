import { QortalGetMetadata } from 'qapp-core';

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

export const qortalGetMetadataToString = (resource: QortalGetMetadata) => {
  return `/arbitrary/${resource.service}/${resource.name}/${resource.identifier}`;
};
export const processFilename = (filename: string): string => {
  // Characters that are not allowed in filenames across major operating systems
  // Windows: < > : " / \ | ? *
  // macOS: : (colon)
  // Linux: / (forward slash)
  const invalidChars = /[<>:"/\\|?*]/g;

  // Replace invalid characters with nothing (remove them)
  return filename.replace(invalidChars, '');
};
