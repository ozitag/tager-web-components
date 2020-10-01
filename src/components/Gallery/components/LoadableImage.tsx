import React, { useEffect, useState } from 'react';

import { FETCH_STATUSES, FetchStatus } from '@tager/web-core';

import Spinner from './Spinner';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

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
    return <Spinner show />;
  }

  if (status === FETCH_STATUSES.SUCCESS) {
    return <img {...props} />;
  }

  return null;
}

export default LoadableImage;
