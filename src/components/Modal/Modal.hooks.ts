import React from 'react';

import { createContextHookWithProvider } from '@tager/web-core';

import { ModalProps, OpenModalFunction } from './Modal.types';

const [useCtx, CtxProvider] = createContextHookWithProvider<OpenModalFunction>(
  'ModalContext'
);

export function useModal() {
  const context = useCtx();

  return context as <P extends ModalProps>(
    type: React.ElementType<P>,
    props: P['innerProps']
  ) => void;
}

export const ModalContextProvider = CtxProvider;
