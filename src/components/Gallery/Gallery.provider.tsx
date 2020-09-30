import React, { useCallback, useState } from 'react';

import { GalleryContextProvider } from './Gallery.hooks';
import { GalleryContextValue, GalleryOptions } from './Gallery.types';
import Gallery from './Gallery';

type Props = {
  children:
    | React.ReactNode
    | ((galleryContext: GalleryContextValue) => React.ReactNode);
};

type State =
  | { isOpen: true; options: GalleryOptions }
  | { isOpen: false; options: null };

function GalleryProvider(props: Props) {
  const [state, setState] = useState<State>({ isOpen: false, options: null });

  const openGallery = useCallback(
    (options: GalleryOptions) => setState({ isOpen: true, options }),
    []
  );

  const closeGallery = useCallback(
    () => setState({ isOpen: false, options: null }),
    []
  );

  function renderChildren() {
    if (typeof props.children === 'function') {
      return props.children(openGallery);
    }

    return props.children;
  }

  return (
    <GalleryContextProvider value={openGallery}>
      {state.isOpen ? (
        <Gallery onClose={closeGallery} options={state.options} />
      ) : null}

      {renderChildren()}
    </GalleryContextProvider>
  );
}

export default GalleryProvider;
