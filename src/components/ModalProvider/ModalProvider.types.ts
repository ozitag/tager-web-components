import React from 'react';

import { OverlayProps } from '../Overlay';

export type State = {
  type: React.ComponentType<ModalProps>;
  props: object;
  options?: OpenModalFunctionOptions;
};

export interface ModalProviderProps {
  children: React.ReactNode;
  components?: { Overlay?: React.ComponentType<OverlayProps> };
  withAnimation?: boolean;
}

export type OpenModalFunctionOptions = Omit<ModalProviderProps, 'children'>;

export interface OpenModalFunction<P extends ModalProps> {
  (type: React.ComponentType<P>, props: P['innerProps']): void;
  (
    type: React.ComponentType<P>,
    props: P['innerProps'],
    options?: OpenModalFunctionOptions
  ): void;
}

export type ModalProps<T = {}> = {
  closeModal: () => void;
  innerProps: T;
};
