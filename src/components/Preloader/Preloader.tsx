import React, { useEffect, useState } from 'react';

import { isBrowser, notFalsy, useUpdateEffect } from '@tager/web-core';

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
  className?: string;
  debug?: boolean;
};

function Preloader({ hidden: hiddenProp, className, debug }: Props) {
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

  useEffect(() => {
    if (!debug) return;

    console.log(
      `%c [DEBUG Preloader]: isControlled - ${isControlled}`,
      'color: green'
    );
    console.log(
      `%c [DEBUG Preloader]: isInitiallyVisible - ${isInitiallyVisible()}`,
      'color: green'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debug]);

  useEffect(() => {
    if (!debug) return;

    console.log(`%c [DEBUG Preloader]: status - ${status}`, 'color: green');
  }, [debug, status]);

  function handleAnimationEnd(): void {
    setStatus('HIDDEN');
  }

  useUpdateEffect(() => {
    if (isControlled) {
      setStatus(hiddenProp ? 'FADING_OUT' : 'VISIBLE');
    }
  }, [hiddenProp, isControlled]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled]);

  if (status === 'HIDDEN') {
    return null;
  }

  const containerClassName = [
    status === 'FADING_OUT' ? 'fade-out' : undefined,
    className,
  ]
    .filter(notFalsy)
    .join(' ');

  return (
    <S.Overlay
      className={containerClassName}
      onAnimationEnd={handleAnimationEnd}
      data-preloader-overlay
    >
      <S.Inner data-preloader>
        <S.Item data-preloader-item />
        <S.Item data-preloader-item />
      </S.Inner>
    </S.Overlay>
  );
}

export default Preloader;
