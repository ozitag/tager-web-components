import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { Nullable, useOnKeyDown } from '@tager/web-core';

import Overlay from '../Overlay';

import {
  CommonModalOptions,
  ModalProps,
  OpenModalFunction,
  State
} from './ModalProvider.types';
import { ModalContextProvider } from './ModalProvider.hooks';

export interface ModalProviderProps extends CommonModalOptions {
  children: React.ReactNode;
}

function ModalProvider(props: ModalProviderProps) {
  const [modal, setModal] = useState<Nullable<State>>(null);
  const [isInnerContentVisible, setInnerContentVisible] = useState(false);

  const withAnimation =
    modal?.options?.withAnimation ?? props.withAnimation ?? true;

  const openModal = useCallback<OpenModalFunction<ModalProps>>(
    (...args: Parameters<OpenModalFunction<ModalProps>>) =>
      setModal({ type: args[0], props: args[1], options: args[2] }),
    []
  );

  useEffect(
    function showInnerContentIfModalOpen() {
      if (modal) {
        setInnerContentVisible(true);
      }
    },
    [modal]
  );

  const closeModal = useCallback(
    function hideInnerContent() {
      setInnerContentVisible(false);

      if (!withAnimation) {
        setModal(null);
      }
    },
    [withAnimation]
  );

  function handleTransitionEnd() {
    if (!isInnerContentVisible) {
      setModal(null);
    }
  }

  useOnKeyDown(props.modalCloseKeys ?? ['Escape', 'Esc'], () => {
    if (modal) {
      closeModal();
    }
  });

  const ModalOverlay =
    modal?.options?.components?.Overlay ?? props.components?.Overlay ?? Overlay;

  const scrollLockDisabled =
    modal?.options?.scrollLockDisabled ?? props.scrollLockDisabled ?? false;

  const isOpen = Boolean(modal);

  const onCloseByModalOverlay = !props.disableCloseByOutside ? closeModal : undefined;

  return (
    <ModalContextProvider value={openModal}>
      <ModalOverlay
        data-testid='modal-overlay'
        data-modal-overlay
        onClose={onCloseByModalOverlay}
        hidden={!isOpen}
        scrollLockDisabled={scrollLockDisabled}
      >
        <ModalInner
          isOpen={isInnerContentVisible}
          withAnimation={withAnimation}
          onTransitionEnd={handleTransitionEnd}
        >
          {modal
            ? React.createElement<ModalProps>(modal.type, {
              closeModal,
              innerProps: modal.props
            })
            : null}
        </ModalInner>
      </ModalOverlay>

      {props.children}
    </ModalContextProvider>
  );
}

const ModalInner = styled.div<{ isOpen: boolean; withAnimation: boolean }>`
  transition: ${(props) =>
          props.withAnimation
                  ? 'transform 0.35s ease-in-out, opacity 0.35s ease-in-out'
                  : 'none'};

  ${(props) =>
          props.isOpen
                  ? css`
                    transform: scale(1);
                    opacity: 1;
                  `
                  : css`
                    transform: scale(0);
                    opacity: 0;
                  `}
`;

export default ModalProvider;
