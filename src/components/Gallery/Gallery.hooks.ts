import { createContextHookWithProvider } from '@tager/web-core';

import { GalleryContextValue } from './Gallery.types';

const [
  useCtx,
  CtxProvider,
] = createContextHookWithProvider<GalleryContextValue>('GalleryContext');

export const useGallery = useCtx;
export const GalleryContextProvider = CtxProvider;
