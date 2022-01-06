import React from 'react';

import { createContextHookWithProvider } from '@tager/web-core';

import {
  ModalProps,
  OpenModalFunction,
  OpenModalFunctionOptions,
  closeModalFunction,
} from './ModalProvider.types';

const [useCtx, CtxProvider] = createContextHookWithProvider<{
  openModal: OpenModalFunction<any>;
  closeModal: closeModalFunction;
}>('ModalContext');

export function useModal() {
  const context = useCtx();

  return context as {
    openModal: <P extends ModalProps>(
      type: React.ComponentType<P>,
      props: P['innerProps'],
      options?: OpenModalFunctionOptions
    ) => void;
    closeModal: closeModalFunction;
  };
}

export const ModalContextProvider = CtxProvider;
