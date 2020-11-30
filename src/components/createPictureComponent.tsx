import React from 'react';

import { convertSrcSet, getImageTypeFromUrl, Nullish } from '@tager/web-core';

import { createMediaQuery } from '../utils/mixin';

import Image from './Image';

interface ImageSourceProps
  extends React.SourceHTMLAttributes<HTMLSourceElement> {
  srcList: Array<string>;
  isLazy: boolean;
}

function Source({ srcList, isLazy, type, srcSet, ...rest }: ImageSourceProps) {
  return (
    <source
      srcSet={isLazy ? undefined : convertSrcSet(srcList)}
      data-srcset={isLazy ? convertSrcSet(srcList) : undefined}
      type={type ?? getImageTypeFromUrl(srcList[0]) ?? undefined}
      {...rest}
    />
  );
}

export interface PictureImageType {
  src?: Nullish<string>;
  src2x?: Nullish<string>;
  webp?: Nullish<string>;
  webp2x?: Nullish<string>;
}

interface SourceGroupProps {
  media?: string;
  images?: PictureImageType;
  isLazy: boolean;
}

function SourceGroup({ media, images, isLazy }: SourceGroupProps) {
  if (!images) return null;

  const { src, src2x, webp, webp2x } = images;

  if (!src && !webp) {
    return null;
  }

  return (
    <>
      {webp && webp2x ? (
        <Source
          isLazy={isLazy}
          srcList={[webp, webp2x]}
          type="image/webp"
          media={media}
        />
      ) : webp ? (
        <Source
          isLazy={isLazy}
          type="image/webp"
          srcList={[webp]}
          media={media}
        />
      ) : null}

      {src && src2x ? (
        <Source isLazy={isLazy} srcList={[src, src2x]} media={media} />
      ) : src ? (
        <Source isLazy={isLazy} srcList={[src]} media={media} />
      ) : null}
    </>
  );
}

type MediaImages<MediaQueryType extends string> = {
  [key in MediaQueryType]?: PictureImageType;
};

export type PictureProps<MediaQueryType extends string> = MediaImages<
  MediaQueryType
> & {
  srcSet?: PictureImageType;
  src?: Nullish<string>;
  src2x?: Nullish<string>;
  srcWebp?: Nullish<string>;
  srcWebp2x?: Nullish<string>;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  imageRef?: React.Ref<HTMLImageElement>;
};

export function createPictureComponent<MediaQueryType extends string>({
  mediaQueryMap,
}: {
  mediaQueryMap: Record<MediaQueryType, string>;
}): React.FunctionComponent<PictureProps<MediaQueryType>> {
  function Picture<MediaQueryType extends string>({
    src,
    src2x,
    srcWebp,
    srcWebp2x,
    alt,
    className,
    loading,
    imageRef,
    ...rest
  }: PictureProps<MediaQueryType>) {
    const isLazy = loading === 'lazy';

    // const [isSpinnerVisible, setSpinnerVisible] = useState<boolean>(false);
    // const imageRef = useRef<HTMLImageElement>(null);
    //
    // useEffect(() => {
    //   if (!showSpinner || !imageRef.current) return;
    //
    //   const image = imageRef.current;
    //
    //   console.log('image.complete', image.complete);
    //   if (image.complete) return;
    //
    //   setSpinnerVisible(true);
    //
    //   image.addEventListener('load', () => {
    //     setSpinnerVisible(false);
    //   });
    //
    //   image.addEventListener('error', () => {
    //     setSpinnerVisible(false);
    //   });
    // }, []);
    //
    // console.log('isSpinnerVisible', isSpinnerVisible);
    return (
      <picture className={className}>
        {Object.keys(mediaQueryMap).map((key) => {
          const mediaKey = key as MediaQueryType;
          const imageMapByMediaQuery = (rest as unknown) as MediaImages<
            MediaQueryType
          >;
          return (
            <SourceGroup
              key={key}
              media={mediaQueryMap[mediaKey]}
              images={imageMapByMediaQuery[mediaKey]}
              isLazy={isLazy}
            />
          );
        })}
        {src2x || srcWebp || srcWebp2x ? (
          <SourceGroup
            images={{
              src: src,
              src2x: src2x,
              webp: srcWebp,
              webp2x: srcWebp2x,
            }}
            isLazy={isLazy}
          />
        ) : null}
        <Image
          src={src ?? undefined}
          srcSet={src2x ? `${src2x} 2x` : undefined}
          loading={loading}
          alt={alt}
          ref={imageRef}
        />
      </picture>
    );
  }

  Picture.displayName = 'Picture';

  return Picture;
}

type MediaQueryType =
  | 'mobileSmall'
  | 'mobileLarge'
  | 'tabletSmall'
  | 'tabletLarge'
  | 'laptop'
  | 'desktop';

export const breakpoints = {
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

const MEDIA_QUERY_MAP: Record<MediaQueryType, string> = {
  desktop: createMediaQuery({ min: breakpoints.desktop }),
  laptop: createMediaQuery({ min: breakpoints.laptop }),
  tabletLarge: createMediaQuery({ min: breakpoints.tabletLarge }),
  tabletSmall: createMediaQuery({ min: breakpoints.tabletSmall }),
  mobileLarge: createMediaQuery({ min: 480 }),
  mobileSmall: createMediaQuery({ min: breakpoints.mobileSmall }),
};

const NewPicture = createPictureComponent({ mediaQueryMap: MEDIA_QUERY_MAP });
