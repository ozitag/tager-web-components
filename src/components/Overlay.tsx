import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { scroller } from '@tager/web-core';

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  scrollLockDisabled?: boolean;
}

function Overlay({
                   onClick,
                   hidden,
                   scrollLockDisabled,
                   ...rest
                 }: OverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollLockDisabled) return;

    if (!hidden) {
      scroller.lock(ref.current);
    }

    return () => scroller.unlockAll();
  }, [hidden, scrollLockDisabled]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    /** if click occurs on overlay */
    if (event.target === event.currentTarget) {
      onClick();
    }
  }

  let lastEvents: string[] = [];

  return (
    <Container ref={ref} onClick={(e) => {
      if (lastEvents.length >= 2 && lastEvents[lastEvents.length - 2] === 'onMouseDown' && lastEvents[lastEvents.length - 1] === 'onMouseUp') {
        handleClick(e);
      } else if (lastEvents.length >= 3 && lastEvents[lastEvents.length - 3] === 'onMouseDown' && lastEvents[lastEvents.length - 1] === 'onMouseUp') {
        handleClick(e);
      } else {
        lastEvents = [];
      }
    }} onMouseDown={() => {
      lastEvents.push('onMouseDown');
    }} onMouseUp={() => {
      lastEvents.push('onMouseUp');
    }} onMouseMove={() => {
      lastEvents.push('onMouseMove');
    }} hidden={hidden} {...rest} />
  );
}

const Container = styled.div`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px;
  position: fixed;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  &[hidden] {
    display: none;
  }
`;

export default Overlay;
