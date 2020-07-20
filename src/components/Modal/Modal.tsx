import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import { useOnKeyDown } from '@tager/web-core';

import {
  ModalOverlayType,
  ModalProps,
  OpenModalFunction,
  State,
} from './Modal.types';
import * as S from './Modal.style';
import { ModalContextProvider } from './Modal.hooks';

type Props = {
  children: React.ReactNode;
  customModalOverlay?: ModalOverlayType;
};

function ModalProvider({ children, customModalOverlay }: Props) {
  const [state, setState] = useState<State>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = Boolean(state.type);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      disableBodyScroll(modalRef.current);
    }

    return () => clearAllBodyScrollLocks();
  }, [isOpen]);

  const openModal = useCallback<OpenModalFunction>(
    (...args: Parameters<OpenModalFunction>) =>
      setState({ type: args[0], props: args[1], options: args[2] }),
    []
  );
  const closeModal = useCallback(() => setState({}), []);

  useOnKeyDown('Escape', () => {
    if (isOpen) {
      closeModal();
    }
  });

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    // if modal is opened and click occurs on overlay
    if (isOpen && event.target === event.currentTarget) closeModal();
  }

  const componentProps: ModalProps<any> = useMemo(
    () => ({
      innerProps: state.props ?? {},
      closeModal,
    }),
    [closeModal, state.props]
  );

  const Component = state.type;

  const ModalOverlay: ModalOverlayType =
    state.options?.customModalOverlay ?? customModalOverlay ?? S.ModalOverlay;

  return (
    <ModalContextProvider value={openModal}>
      <ModalOverlay
        isOpen={isOpen}
        onClick={handleOverlayClick}
        data-testid="modal-overlay"
        data-modal-overlay
        ref={modalRef}
      >
        {Component ? <Component {...componentProps} /> : null}
      </ModalOverlay>
      {children}
    </ModalContextProvider>
  );
}

export default ModalProvider;
