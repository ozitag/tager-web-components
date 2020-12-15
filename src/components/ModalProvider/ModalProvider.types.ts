import React from 'react';

import { OverlayProps } from '../Overlay';

export interface State {
  type: React.ComponentType<ModalProps>;
  props: object;
  options?: OpenModalFunctionOptions;
}

export interface CommonModalOptions {
  components?: { Overlay?: React.ComponentType<OverlayProps> };
  withAnimation?: boolean;
}

export interface OpenModalFunctionOptions extends CommonModalOptions {}

export interface OpenModalFunction<P extends ModalProps> {
  (type: React.ComponentType<P>, props: P['innerProps']): void;
  (
    type: React.ComponentType<P>,
    props: P['innerProps'],
    options?: OpenModalFunctionOptions
  ): void;
}

export interface ModalProps<T = {}> {
  closeModal: () => void;
  innerProps: T;
}
