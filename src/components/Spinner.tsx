import React from 'react';
import styled, { Keyframes, keyframes } from 'styled-components';

interface SpinnerProps {
  show: boolean;
  size?: number;
  thickness?: number;
  color?: string;
}

function Spinner(props: SpinnerProps) {
  const size = props.size ?? 100;
  const thickness = props.thickness ?? 4;
  return (
    <Container visible={Boolean(props.show)}>
      <Inner size={size}>
        <Circle thickness={thickness} color={props.color} />
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

const Inner = styled.div<{ size: number }>`
  display: inline-block;
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

function getAnimation(props: { thickness: number }): Keyframes {
  return keyframes`
  from {
      top: 50%;
      left: 50%;
      width: ${props.thickness * 2}px;
      height: ${props.thickness * 2}px;
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
}

const Circle = styled.div<{ thickness: number; color?: string }>`
  position: absolute;

  border: ${(props) => props.thickness}px solid
    ${(props) => props.color ?? 'white'};
  opacity: 1;
  border-radius: 50%;
  animation-name: ${(props) => getAnimation({ thickness: props.thickness })};
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  animation-iteration-count: infinite;
`;

export default Spinner;
