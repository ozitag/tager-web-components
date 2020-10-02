import React, { CSSProperties, useEffect, useState } from 'react';

import { FETCH_STATUSES, FetchStatus } from '@tager/web-core';

import Spinner from './Spinner';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  spinnerContainerStyle?: CSSProperties;
  spinnerProps?: Partial<React.ComponentProps<typeof Spinner>>;
};

function LoadableImage(props: Props) {
  const [status, setStatus] = useState<FetchStatus>(FETCH_STATUSES.LOADING);

  useEffect(() => {
    if (!props.src) return;

    const image = new Image();

    image.addEventListener('load', () => {
      setStatus(FETCH_STATUSES.SUCCESS);
    });

    image.addEventListener('error', () => {
      setStatus(FETCH_STATUSES.FAILURE);
    });

    image.src = props.src;
  }, [props.src]);

  if (status === FETCH_STATUSES.LOADING) {
    return (
      <div style={props.spinnerContainerStyle}>
        <Spinner {...props.spinnerProps} show />
      </div>
    );
  }

  if (status === FETCH_STATUSES.SUCCESS) {
    return <img {...props} />;
  }

  return (
    <div style={props.spinnerContainerStyle}>
      <img {...props} alt={props.alt || 'Loading error'} />
    </div>
  );
}

export default LoadableImage;
