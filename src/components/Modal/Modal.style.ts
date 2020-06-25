import styled, { css } from 'styled-components';

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  overflow-y: auto;
  ${(props) =>
    !props.isOpen
      ? css`
          display: none;
        `
      : ''};
`;

export const ModalContainer = styled.div<{ width?: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: ${(props) => props.width || 600}px;
  width: 100%;

  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
`;
