import React from 'react';
import { Story } from '@storybook/react';

import Preloader from './Preloader';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  component: Preloader,
  title: 'Preloader',
  argTypes: {
    hidden: {
      type: 'boolean',
    },
    debug: {
      type: 'boolean',
    },
  },
};

const Template: Story<React.ComponentProps<typeof Preloader>> = (args) => (
  <Preloader {...args} />
);

export const PreloaderDefault = Template.bind({});
PreloaderDefault.storyName = 'Preloader';
PreloaderDefault.args = {
  debug: true,
  hidden: false,
};
