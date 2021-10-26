import React from 'react';
import { Story } from '@storybook/react';

import Spinner, { SpinnerProps } from './Spinner';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  component: Spinner,
  title: 'Spinner',
  argTypes: {
    color: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    thickness: {
      type: 'number',
    },
  },
};

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const SpinnerDefault = Template.bind({});
SpinnerDefault.storyName = 'Spinner';
SpinnerDefault.args = {};
