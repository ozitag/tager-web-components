import React, { CSSProperties, useEffect, useState } from 'react';

import { FETCH_STATUSES, FetchStatus } from '@tager/web-core';

import Spinner from './Spinner/Spinner';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  spinnerContainerStyle?: CSSProperties;
  spinnerProps?: Partial<React.ComponentProps<typeof Spinner>>;
};

function LoadableImage({
  spinnerProps,
  spinnerContainerStyle,
  ...imageProps
}: Props) {
  const [status, setStatus] = useState<FetchStatus>(FETCH_STATUSES.LOADING);

  useEffect(() => {
    if (!imageProps.src) return;

    const image = new Image();

    image.addEventListener('load', () => {
      setStatus(FETCH_STATUSES.SUCCESS);
    });

    image.addEventListener('error', () => {
      setStatus(FETCH_STATUSES.FAILURE);
    });

    image.src = imageProps.src;
  }, [imageProps.src]);

  if (status === FETCH_STATUSES.LOADING) {
    return (
      <div style={spinnerContainerStyle}>
        <Spinner {...spinnerProps} show />
      </div>
    );
  }

  if (status === FETCH_STATUSES.SUCCESS) {
    return <img {...imageProps} alt={imageProps.alt} />;
  }

  return (
    <div style={spinnerContainerStyle}>
      <img {...imageProps} alt={imageProps.alt || 'Loading error'} />
    </div>
  );
}

export default LoadableImage;
