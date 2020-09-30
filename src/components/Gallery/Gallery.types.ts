import { Nullish } from '@tager/web-core';

export type GalleryOptions = {
  imageList: Array<{ url: string; caption?: Nullish<string> }>;
  initialIndex?: number;
};
export type OpenGalleryFunction = (options: GalleryOptions) => void;

export type GalleryContextValue = OpenGalleryFunction;
