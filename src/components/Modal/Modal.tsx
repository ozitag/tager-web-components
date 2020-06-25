import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import { useOnKeyDown } from '@tager/web-core';

import { ModalProps, OpenModalFunction, State } from './Modal.types';
import * as S from './Modal.style';
import { ModalContextProvider } from './Modal.hooks';

type Props = {
  children: React.ReactNode;
};

function ModalProvider({ children }: Props) {
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
    (type, props) => setState({ type, props }),
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

  return (
    <ModalContextProvider value={openModal}>
      <S.ModalOverlay
        isOpen={isOpen}
        onClick={handleOverlayClick}
        data-testid="modal-overlay"
        ref={modalRef}
      >
        {Component ? <Component {...componentProps} /> : null}
      </S.ModalOverlay>
      {children}
    </ModalContextProvider>
  );
}

export default ModalProvider;
