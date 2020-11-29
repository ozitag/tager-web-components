import React from 'react';

/**
 * Placeholder fixes broken image symbol: https://github.com/aFarkas/lazysizes#broken-image-symbol
 *
 * Reference: https://github.com/verlok/vanilla-lazyload/issues/212#issuecomment-397807313
 *
 * If you don't put anything in the `src`,
 * when `lazysizes` copies the `data-src` in the `src`,
 * the image is shown while loading by the browser.
 *
 * If you put something in the `src`,
 * when `lazysizes` copies the `data-src` in the `src`,
 * the browser waits until the new image is loaded, then replaces the image.
 * That what we do when images are loaded lazily.
 */
// const PLACEHOLDER =
//   'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function ImageWithRef(
    { className, src, srcSet, loading = 'eager', ...rest },
    ref
  ) {
    const isLazy = loading === 'lazy';

    const imgClassName = [className, isLazy ? 'lazyload' : null]
      .filter(Boolean)
      .join(' ');
    return (
      <img
        className={imgClassName}
        ref={ref}
        src={isLazy ? undefined : src}
        srcSet={isLazy ? undefined : srcSet}
        data-src={src}
        data-srcset={srcSet}
        alt=""
        {...rest}
      />
    );
  }
);

export default Image;
