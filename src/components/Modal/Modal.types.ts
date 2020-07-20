import React from 'react';

export type ModalType<P = any> = React.ElementType<P>;

export type ModalOverlayType = React.ComponentType<
  JSX.IntrinsicElements['div'] & { isOpen: boolean }
>;

export type State = {
  type?: ModalType;
  props?: any;
  options?: OpenModalFunctionOptions;
};

export type OpenModalFunctionOptions = {
  customModalOverlay?: ModalOverlayType;
};

export interface OpenModalFunction<T = any> {
  (type: ModalType, props?: T): void;
  (type: ModalType, props?: T, options?: OpenModalFunctionOptions): void;
}

export type ModalComponentProps<
  M extends React.ElementType
> = React.ComponentProps<M>['innerProps'];

export type ModalProps<T = {}> = {
  closeModal: () => void;
  innerProps: T;
};
