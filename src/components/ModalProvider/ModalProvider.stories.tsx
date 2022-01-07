import React from 'react';
import { Story } from '@storybook/react';
import styled from 'styled-components';

import ModalProvider from './ModalProvider';
import { useModal } from './ModalProvider.hooks';
import { ModalProps } from './ModalProvider.types';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  component: ModalProvider,
  title: 'ModalProvider',
  decorators: [
    (Story: React.ComponentType) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
};

const Button = styled.button`
  border-radius: 3px;
  border: 1px solid black;
  padding: 0.4rem 0.7rem;
`;

type AuthModalProps = ModalProps<{ email: string; password: string }>;

function AuthModal({ closeModal, innerProps }: AuthModalProps) {
  const { email, password } = innerProps;
  return (
    <div style={{ padding: 30, background: 'white' }}>
      <h1>Auth Modal</h1>
      <div>
        <label>Email</label>
        <input type={'email'} defaultValue={email} />
      </div>
      <div>
        <label>Password</label>
        <input type={'text'} defaultValue={password} />
      </div>
      <Button type="button" onClick={closeModal}>
        Close Modal
      </Button>
    </div>
  );
}

const Template: Story = () => {
  const openModal = useModal();

  return (
    <div>
      <Button
        type={'button'}
        onClick={() =>
          openModal(AuthModal, { email: 'fwqewe@fwqe.fw', password: '423543' })
        }
      >
        Open Modal
      </Button>
      <div style={{ height: '120vh', marginTop: 100 }}>some long content</div>
    </div>
  );
};

export const ModalDefault = Template.bind({});
ModalDefault.storyName = 'Modal';
