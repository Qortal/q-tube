import { useTestIdentifiers } from "./Identifiers.ts";

export const minPriceSuperLike = 1;
export const minPriceSuperDislike = 1;

export const titleFormatter = /[\r\n]+/g;
export const titleFormatterOnSave = /[\r\n/<>:"'\\*|?]+/g;

export const videoMaxSize = 400; // Size in Megabytes (decimal)
export const maxSize = videoMaxSize * 1024 * 1024;

export const fontSizeExSmall = "60%";
export const fontSizeSmall = "80%";
export const fontSizeMedium = "100%";
export const fontSizeLarge = "120%";
export const fontSizeExLarge = "150%";
export const maxCommentLength = 10_000;
export const minFileSize = 1_000;
export const minDuration = 1;

const newUIWidthDiff = 120;
const smallScreenSize = 700 - newUIWidthDiff;
const largeScreenSize = 1400 - newUIWidthDiff;
export const smallScreenSizeString = `${smallScreenSize}px`;
export const largeScreenSizeString = `${largeScreenSize}px`;

export const smallVideoSize = `(min-width:720px)`;
export const headerIconSize = "40px";
export const menuIconSize = "28px";
