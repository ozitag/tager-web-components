import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { scroller } from '@tager/web-core';

export type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  onClose: () => void;
};

function Overlay({ onClose, children, ...rest }: OverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.lock(ref.current);

    return () => scroller.unlockAll();
  }, []);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    /** if click occurs on overlay */
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <Container ref={ref} onClick={handleClick} {...rest}>
      {children}
    </Container>
  );
}

const Container = styled.div`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px;
  position: fixed;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Overlay;
