import React, { useState } from 'react';
import { Story } from '@storybook/react';

import { createMediaQuery } from '../../utils/mixin';
import Spinner from '../Spinner';

import { createPlainPictureComponent, PictureMediaQueryItemType, PlainPictureProps } from './createPlainPictureComponent';
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
  desktop: 1500
};

const MEDIA_QUERY_LIST: Array<PictureMediaQueryItemType<MediaQueryType>> = [
  { name: 'desktop', value: createMediaQuery({ min: breakpoints.desktop }) },
  { name: 'laptop', value: createMediaQuery({ min: breakpoints.laptop }) },
  {
    name: 'tabletLarge',
    value: createMediaQuery({ min: breakpoints.tabletLarge })
  },
  {
    name: 'tabletSmall',
    value: createMediaQuery({ min: breakpoints.tabletSmall })
  },
  { name: 'mobileLarge', value: createMediaQuery({ min: 480 }) },
  {
    name: 'mobileSmall',
    value: createMediaQuery({ min: breakpoints.mobileSmall })
  }
];

const PlainPicture = createPlainPictureComponent({
  mediaQueryList: MEDIA_QUERY_LIST
});

const Picture = createPictureComponent({
  mediaQueryList: MEDIA_QUERY_LIST
});

export default {
  title: 'Picture'
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
  src: 'https://wallpaperaccess.com/full/1369012.jpg'
  // src: 'https://wallpaperaccess.com/full/1369012.jpg',
  // loading: 'lazy',
};


const PlainPictureLazyTemplate: Story<PlainPictureProps<MediaQueryType>> = (
  args
) => {
  const image1 = 'https://wallpaperaccess.com/full/1369012.jpg';
  const image2 = 'https://cdn.atlantm.com/static/multifile/1403/21/atlantm_geely_nezavisimosti.jpg';

  const [src, setSrc] = useState<string>(image1);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{height: '1500px', width: '100%', background: 'red'}}/>
      <PlainPicture {...args} src={src} />
      <div style={{height: '0', width: '100%', background: 'red'}}/>
      <button style={{ border: '1px solid #000', padding: '10px', marginTop: '10px' }} onClick={() => {
        setSrc(src === image1 ? image2 : image1);
      }}>Change src
      </button>
    </div>
  );
};

export const PlainPictureLazy = PlainPictureLazyTemplate.bind({});
PlainPictureLazy.storyName = 'PlainPictureLazy';
PlainPictureLazy.args = {
  src: 'https://wallpaperaccess.com/full/1369012.jpg',
  loading: 'lazy'
};

const PlainPictureSourceLazyTemplate: Story<PlainPictureProps<MediaQueryType>> = () => {
  const [imageNumber, setImageNumber] = useState<number>(0);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{height: '2000px', width: '100%', background: 'red'}}/>
      <Picture loading="lazy"
                    desktop={{src: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.png', src2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.png', webp: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.webp', webp2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.webp'}}
                    laptop={{src: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.png', src2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.png', webp: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.webp', webp2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.webp'}}
                    tabletSmall={{src: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.png', src2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.png', webp: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.webp', webp2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.webp'}}
                    mobileSmall={{src: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.png', src2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.png', webp: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO.webp', webp2x: 'https://atlantm.by/uploads/dealers-web-main/mi/7s/mi7sQQZ62a_AUTO_AUTO@2x.webp'}}
      />
      <button style={{ border: '1px solid #000', padding: '10px', marginTop: '10px' }} onClick={() => {
        setImageNumber(imageNumber === 1 ? 0 : 1);
      }}>
        Change src
      </button>
    </div>
  );
};


export const PlainPictureSourceLazy = PlainPictureSourceLazyTemplate.bind({});
PlainPictureSourceLazy.storyName = 'PlainPictureSourceLazy';
PlainPictureSourceLazy.args = {
  src: 'https://wallpaperaccess.com/full/1369012.jpg',
  loading: 'lazy'
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
  spinnerComponent: () => <Spinner show color='black' />,
  height: 450,
  width: 800
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
  width: 800
};
