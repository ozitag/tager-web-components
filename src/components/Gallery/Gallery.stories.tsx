import React from 'react';
import { Story } from '@storybook/react';

import Gallery from './Gallery';
import GalleryProvider from './Gallery.provider';
import { GalleryOptions } from './Gallery.types';
import { useGallery } from './Gallery.hooks';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  component: Gallery,
  title: 'Gallery',
  decorators: [
    (Story: React.ComponentType) => (
      <GalleryProvider>
        <Story />
      </GalleryProvider>
    ),
  ],
  argTypes: {
    hidden: {
      type: 'boolean',
    },
    debug: {
      type: 'boolean',
    },
  },
};

const Template: Story<GalleryOptions> = (args) => {
  const openGallery = useGallery();

  function handleClick() {
    openGallery(args);
  }

  // useEffect(() => {
  //   handleClick();
  // }, []);

  return (
    <button type={'button'} onClick={handleClick}>
      Open gallery
    </button>
  );
};

export const GalleryDefault = Template.bind({});
GalleryDefault.storyName = 'Gallery';
GalleryDefault.args = {
  imageList: [
    {
      url:
        'https://belmebel.dev.ozitag.com/uploads/payment-page/2j/ev/2jEvIOkhtQ_1900_1000.png',
      caption: 'Образец товарного чека',
    },
    {
      url:
        'https://belmebel.by/uploads/products/cf/aw/Cfaw2MP27W1id6JRPHK1NYbFye1QB6tT.jpg',
    },
    {
      url:
        'https://belmebel.by/uploads/products/nn/lm/NNLMytwVAcgjAyCYOuy7kNJ0fTtMkp_9.jpg',
      caption: 'Секция левая/правая - Ш x В x Г: 48 x 36 x 36 см.',
    },
    {
      url:
        'https://presetbox.dev.ozitag.com/uploads/products/uh/2p/UH2pRvO09N_347_460.webp',
    },
    {
      url:
        'http://wallpaperswide.com/download/road_aspens_trees_in_colorado_summer-wallpaper-2560x1600.jpg',
    },
    {
      url:
        'https://belmebel.by/uploads/products/ff/rt/FFRt4QUIds3z20kF43WuSoe_DMcWVHcZ.jpg',
      caption: 'Кровать - Ш x В x Г: 205 x 98 x 206 см.',
    },
    {
      url:
        'https://belmebel.by/uploads/products/b_/ri/B_RI_M3ArrU5_84Ms47Bcvfgi_jcmGGZ.jpg',
      caption: 'Комод - Ш x В x Г: 98 x 93 x 54 см.',
    },
    {
      url:
        'https://belmebel.by/uploads/products/7s/ih/7SIhLKsL8U51zR55a2fOSLMHOgdzbB3c.jpg',
      caption: 'Шкаф для одежды - Ш x В x Г: 199 x 220 x 61 см.',
    },
  ],
};
