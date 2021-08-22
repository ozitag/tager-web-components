import React from 'react';
import { Story } from '@storybook/react';

import { createMediaQuery } from '../../utils/mixin';
import Spinner from '../Spinner';

import {
  createPlainPictureComponent,
  PictureMediaQueryItemType,
  PlainPictureProps,
} from './createPlainPictureComponent';
import { createPictureComponent, PictureProps } from './createPictureComponent';

type MediaQueryType =
  | 'mobileSmall'
  | 'mobileLarge'
  | 'tabletSmall'
  | 'tabletLarge'
  | 'laptop'
  | 'desktop';

const breakpoints = {
  /** iPhone 5/SE */
  mobileSmall: 320,
  /** iPhone 6/7/8/X */
  mobileMedium: 375,
  /** iPhone 6/7/8 Plus */
  mobileLarge: 414,
  /** iPad 1, 2, Mini and Air */
  tabletSmall: 768,
  tabletLarge: 1024,
  /** 1280 - 16 = 1264 -> 1260 - more beautiful number :) */
  laptop: 1260,
  /** 1536 - 16 = 1520 -> 1500 - more beautiful number :) */
  desktop: 1500,
};

const MEDIA_QUERY_LIST: Array<PictureMediaQueryItemType<MediaQueryType>> = [
  { name: 'desktop', value: createMediaQuery({ min: breakpoints.desktop }) },
  { name: 'laptop', value: createMediaQuery({ min: breakpoints.laptop }) },
  {
    name: 'tabletLarge',
    value: createMediaQuery({ min: breakpoints.tabletLarge }),
  },
  {
    name: 'tabletSmall',
    value: createMediaQuery({ min: breakpoints.tabletSmall }),
  },
  { name: 'mobileLarge', value: createMediaQuery({ min: 480 }) },
  {
    name: 'mobileSmall',
    value: createMediaQuery({ min: breakpoints.mobileSmall }),
  },
];

const PlainPicture = createPlainPictureComponent({
  mediaQueryList: MEDIA_QUERY_LIST,
});

const Picture = createPictureComponent({
  mediaQueryList: MEDIA_QUERY_LIST,
});

export default {
  title: 'Picture',
};

const PlainPictureTemplate: Story<PlainPictureProps<MediaQueryType>> = (
  args
) => (
  <div style={{ maxWidth: 800 }}>
    <PlainPicture {...args} />
  </div>
);

export const PlainPictureDefault = PlainPictureTemplate.bind({});
PlainPictureDefault.storyName = 'PlainPicture';
PlainPictureDefault.args = {
  src: 'https://wallpaperaccess.com/full12.jpg',
  // src: 'https://wallpaperaccess.com/full/1369012.jpg',
  // loading: 'lazy',
};

const PictureTemplate: Story<PictureProps<MediaQueryType>> = (args) => (
  <div>
    <Picture {...args} />
  </div>
);

export const PictureWithSpinner = PictureTemplate.bind({});
PictureWithSpinner.storyName = 'Picture with spinner';
PictureWithSpinner.args = {
  // src: 'https://wallpaperaccess.com/full12.jpg',
  // src: '',
  src: 'https://wallpaperaccess.com/full/1369012.jpg',
  loading: 'lazy',
  useSpinner: true,
  spinnerComponent: () => <Spinner show color="black" />,
  height: 450,
  width: 800,
};

export const PictureWithPlaceholder = PictureTemplate.bind({});
PictureWithPlaceholder.storyName = 'Picture with placeholder';
PictureWithPlaceholder.args = {
  // src: 'https://wallpaperaccess.com/full12.jpg',
  src: 'https://wallpaperaccess.com/full/1369012.jpg',
  loading: 'lazy',
  usePlaceholder: true,
  placeholderColor: '#eee',
  height: 450,
  width: 800,
};
