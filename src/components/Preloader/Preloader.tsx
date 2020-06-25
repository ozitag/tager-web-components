import React, { useEffect, useState } from 'react';
import { isBrowser, useUpdateEffect } from '@tager/web-core';

import { isPreloaderEnabled } from './Preloader.helpers';
import * as S from './Preloader.style';

declare global {
  interface Window {
    isPreloaderHidden: boolean | undefined;
  }
}

type PreloaderStatus = 'VISIBLE' | 'FADING_OUT' | 'HIDDEN';

type Props = {
  hidden?: boolean;
};

function Preloader({ hidden: hiddenProp }: Props) {
  const isControlled = hiddenProp !== undefined;

  function isInitiallyVisible(): boolean {
    const isVisible = isBrowser()
      ? isPreloaderEnabled() && !window.isPreloaderHidden
      : isPreloaderEnabled();

    return isControlled ? !hiddenProp : isVisible;
  }

  const [status, setStatus] = useState<PreloaderStatus>(
    isInitiallyVisible() ? 'VISIBLE' : 'HIDDEN'
  );

  function handleAnimationEnd(): void {
    setStatus('HIDDEN');
  }

  useUpdateEffect(() => {
    if (isControlled) {
      setStatus(hiddenProp ? 'FADING_OUT' : 'VISIBLE');
    }
  }, [hiddenProp]);

  useEffect(() => {
    if (isControlled || status !== 'VISIBLE') return;

    function hidePreloader() {
      setStatus('FADING_OUT');
      window.isPreloaderHidden = true;
    }

    if (document.readyState !== 'loading') {
      hidePreloader();
      return;
    }

    document.addEventListener('DOMContentLoaded', hidePreloader);

    return () => {
      document.removeEventListener('DOMContentLoaded', hidePreloader);
    };
  }, []);

  if (status === 'HIDDEN') {
    return null;
  }

  return (
    <S.Container
      className={status === 'FADING_OUT' ? 'fade-out' : undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      <S.Inner>
        <S.Item />
        <S.Item />
      </S.Inner>
    </S.Container>
  );
}

export default Preloader;
