import styled, { keyframes } from 'styled-components';

export const rotateCss = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const bounceCss = keyframes`
  0%,
  100% {
    transform: scale(0);
  }

  50% {
    transform: scale(1);
  }
`;

export const fadeOutCss = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  opacity: 1;
  will-change: opacity;
  z-index: 1000;

  &.fade-out {
    animation: ${fadeOutCss} 1s ease-in-out forwards;
  }
`;

export const Inner = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  width: 70px;
  height: 70px;
  margin-top: -35px;
  margin-left: -35px;
  text-align: center;
  animation: ${rotateCss} 2s infinite linear;
`;

export const Item = styled.div`
  position: absolute;
  display: inline-block;
  top: 0;
  background-color: #f7f7f7;
  border-radius: 100%;
  width: 35px;
  height: 35px;
  animation: ${bounceCss} 2s infinite ease-in-out;

  &:last-child {
    top: auto;
    bottom: 0;
    animation-delay: -1s;
  }
`;
