import React, { useCallback, useState } from 'react';

import { Nullable, useOnKeyDown } from '@tager/web-core';

import Overlay, { OverlayProps } from '../Overlay';

import { ModalProps, OpenModalFunction, State } from './ModalProvider.types';
import { ModalContextProvider } from './ModalProvider.hooks';

type Props = {
  children: React.ReactNode;
  components?: { Overlay?: React.ComponentType<OverlayProps> };
};

function ModalProvider(props: Props) {
  const [modal, setModal] = useState<Nullable<State>>(null);

  const openModal = useCallback<OpenModalFunction<ModalProps>>(
    (...args: Parameters<OpenModalFunction<ModalProps>>) =>
      setModal({ type: args[0], props: args[1], options: args[2] }),
    []
  );
  const closeModal = useCallback(() => setModal(null), []);

  useOnKeyDown(['Escape', 'Esc'], () => {
    if (modal) {
      closeModal();
    }
  });

  const ModalOverlay =
    modal?.options?.components?.Overlay ?? props.components?.Overlay ?? Overlay;

  return (
    <ModalContextProvider value={openModal}>
      {modal ? (
        <ModalOverlay
          data-testid="modal-overlay"
          data-modal-overlay
          onClose={closeModal}
        >
          {React.createElement<ModalProps>(modal.type, {
            closeModal,
            innerProps: modal.props,
          })}
        </ModalOverlay>
      ) : null}

      {props.children}
    </ModalContextProvider>
  );
}

export default ModalProvider;
