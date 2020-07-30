import React from 'react';
import { convertSrcSet, getImageTypeFromUrl, Nullish } from '@tager/web-core';

import Image from './Image';

type ImageSourceProps = Omit<
  React.SourceHTMLAttributes<HTMLSourceElement>,
  'srcSet'
> & {
  srcSet: Array<string>;
  isLazy: boolean;
};

function Source({ srcSet, isLazy, type, ...rest }: ImageSourceProps) {
  return (
    <source
      srcSet={!isLazy ? convertSrcSet(srcSet) : undefined}
      data-srcset={isLazy ? convertSrcSet(srcSet) : undefined}
      type={type ?? getImageTypeFromUrl(srcSet[0]) ?? undefined}
      {...rest}
    />
  );
}

export type PictureImageType = {
  src?: Nullish<string>;
  src2x?: Nullish<string>;
  webp?: Nullish<string>;
  webp2x?: Nullish<string>;
};

type SourceGroupProps = {
  media?: string;
  images?: PictureImageType;
  isLazy: boolean;
};

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
          srcSet={[webp, webp2x]}
          type="image/webp"
          media={media}
        />
      ) : webp ? (
        <Source
          isLazy={isLazy}
          type="image/webp"
          srcSet={[webp]}
          media={media}
        />
      ) : null}

      {src && src2x ? (
        <Source isLazy={isLazy} srcSet={[src, src2x]} media={media} />
      ) : src ? (
        <Source isLazy={isLazy} srcSet={[src]} media={media} />
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
};

export function createPictureComponent<MediaQueryType extends string>({
  mediaQueryMap,
}: {
  mediaQueryMap: Record<MediaQueryType, string>;
}): React.FunctionComponent<PictureProps<MediaQueryType>> {
  function Picture({
    src,
    src2x,
    srcWebp,
    srcWebp2x,
    alt,
    className,
    loading,
    ...rest
  }: PictureProps<MediaQueryType>) {
    const isLazy = loading === 'lazy';

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
        />
      </picture>
    );
  }

  Picture.displayName = 'Picture';

  return Picture;
}
