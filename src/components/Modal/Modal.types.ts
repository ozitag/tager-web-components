import React from 'react';

export type ModalType<P = any> = React.ElementType<P>;

export type State = {
  type?: ModalType;
  props?: any;
};

export type OpenModalFunction<T = any> = (type: ModalType, props?: T) => void;

export type ModalComponentProps<
  M extends React.ElementType
> = React.ComponentProps<M>['innerProps'];

export type ModalProps<T = {}> = {
  closeModal: () => void;
  innerProps: T;
};
