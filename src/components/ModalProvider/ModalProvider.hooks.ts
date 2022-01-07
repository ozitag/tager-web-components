import React from 'react';

import { createContextHookWithProvider } from '@tager/web-core';

import {
  ModalProps,
  OpenModalFunction,
  OpenModalFunctionOptions,
} from './ModalProvider.types';

const [useCtx, CtxProvider] = createContextHookWithProvider<
  OpenModalFunction<any>
>('ModalContext');

export function useModal() {
  const context = useCtx();

  return context as <P extends ModalProps>(
    type: React.ComponentType<P>,
    props: P['innerProps'],
    options?: OpenModalFunctionOptions
  ) => void;
}

export const ModalContextProvider = CtxProvider;
