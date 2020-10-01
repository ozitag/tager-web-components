import React from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  show: boolean;
};

function Spinner(props: Props) {
  return (
    <Container visible={Boolean(props.show)}>
      <Inner>
        <Circle />
      </Inner>
    </Container>
  );
}

const Container = styled.div<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: opacity 0.3s;
`;

const Inner = styled.div`
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
`;

const animation = keyframes`
  from {
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      opacity: 1;
  }
  
  to {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
  }
`;

const Circle = styled.div`
  position: absolute;
  border: 4px solid white;
  opacity: 1;
  border-radius: 50%;
  animation-name: ${animation};
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  animation-iteration-count: infinite;
`;

export default Spinner;
