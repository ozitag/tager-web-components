import React, { useRef } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

const placeholder =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function Image({ className, src, srcSet, loading = 'eager', ...rest }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  const isLazy = loading === 'lazy';

  const imgClassName = [className, isLazy ? 'lazyload' : null]
    .filter(Boolean)
    .join(' ');
  return (
    <img
      className={imgClassName}
      ref={imageRef}
      src={isLazy ? placeholder : src}
      srcSet={isLazy ? placeholder : srcSet}
      data-src={src}
      data-srcset={srcSet}
      alt=""
      {...rest}
    />
  );
}

export default Image;
