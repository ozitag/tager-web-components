import React from 'react';
import { Story } from '@storybook/react';

import Gallery from './Gallery';
import { ModalComponentProps, ModalProvider, useModal } from '../Modal';

export default {
  component: Gallery,
  title: 'Gallery',
  decorators: [ModalProvider],
  argTypes: {
    hidden: {
      type: 'boolean',
    },
    debug: {
      type: 'boolean',
    },
  },
};

const Template: Story<ModalComponentProps<typeof Gallery>> = (args) => {
  const openModal = useModal();

  function handleClick() {
    openModal(Gallery, args);
  }

  return (
    <button type={'button'} onClick={handleClick}>
      Open gallery
    </button>
  );
};

export const GalleryDefault = Template.bind({});
GalleryDefault.storyName = 'Gallery';
GalleryDefault.args = {
  imageList: [],
};
