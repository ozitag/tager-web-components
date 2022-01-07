import React from 'react';

import { OverlayProps } from '../Overlay';

export interface State {
  type: React.ComponentType<ModalProps>;
  props: Record<string, unknown>;
  options?: OpenModalFunctionOptions;
}

export interface CommonModalOptions {
  components?: {
    Overlay?: React.ComponentType<OverlayProps>;
  };
  withAnimation?: boolean;
  scrollLockDisabled?: boolean;
  shouldCloseOnEscape?: boolean;
  shouldCloseOnClickOutside?: boolean;
}

export type OpenModalFunctionOptions = CommonModalOptions;

export interface OpenModalFunction<P extends ModalProps> {
  (type: React.ComponentType<P>, props: P['innerProps']): void;
  (
    type: React.ComponentType<P>,
    props: P['innerProps'],
    options?: OpenModalFunctionOptions
  ): void;
}

export interface ModalProps<T = Record<string, unknown>> {
  closeModal: () => void;
  innerProps: T;
}
