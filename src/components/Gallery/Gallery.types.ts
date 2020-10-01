export type GalleryOptions = {
  imageList: Array<{ url: string; caption?: string }>;
  initialIndex?: number;
};
export type OpenGalleryFunction = (options: GalleryOptions) => void;

export type GalleryContextValue = OpenGalleryFunction;
