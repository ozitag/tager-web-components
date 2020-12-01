import React from 'react';

import { convertSrcSet, getImageTypeFromUrl, Nullish } from '@tager/web-core';

import Image from './Image';

interface ImageSourceProps
  extends React.SourceHTMLAttributes<HTMLSourceElement> {
  srcList: Array<string>;
  isLazy: boolean;
}

function Source({ srcList, isLazy, type, ...rest }: ImageSourceProps) {
  if (srcList.length === 0) return null;

  return (
    <source
      {...rest}
      srcSet={isLazy ? undefined : convertSrcSet(srcList)}
      data-srcset={isLazy ? convertSrcSet(srcList) : undefined}
      type={type ?? getImageTypeFromUrl(srcList[0] ?? null) ?? undefined}
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

function getSrcList(
  src1x: Nullish<string>,
  src2x: Nullish<string>
): Array<string> {
  const srcList: Array<string> = [];

  if (src1x) {
    srcList.push(src1x);

    if (src2x) {
      srcList.push(src2x);
    }
  }

  return srcList;
}

function SourceGroup({ media, images, isLazy }: SourceGroupProps) {
  if (!images || Object.values(images).length === 0) return null;

  return (
    <>
      <Source
        isLazy={isLazy}
        srcList={getSrcList(images.webp, images.webp2x)}
        media={media}
      />

      <Source
        isLazy={isLazy}
        srcList={getSrcList(images.src, images.src2x)}
        media={media}
      />
    </>
  );
}

interface MediaQueryItemType<QueryName extends string = string> {
  name: QueryName;
  value: string;
}

export interface CommonPictureProps {
  src?: Nullish<string>;
  src2x?: Nullish<string>;
  srcWebp?: Nullish<string>;
  srcWebp2x?: Nullish<string>;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  imageRef?: React.Ref<HTMLImageElement>;
}

export interface SpecialPictureProps {
  mediaQueryList: Array<MediaQueryItemType>;
  imageMap: { [key: string]: PictureImageType | undefined };
}

export interface PictureProps extends CommonPictureProps, SpecialPictureProps {}

function Picture({
  src,
  src2x,
  srcWebp,
  srcWebp2x,
  alt,
  className,
  loading,
  imageRef,
  mediaQueryList,
  imageMap,
}: PictureProps) {
  const isLazy = loading === 'lazy';

  return (
    <picture className={className}>
      {mediaQueryList.map((mediaQuery) => (
        <SourceGroup
          key={mediaQuery.name}
          media={mediaQuery.value}
          images={imageMap[mediaQuery.name]}
          isLazy={isLazy}
        />
      ))}
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

function dedupeMediaQueryList<T extends { name: string }>(
  list: Array<T>
): Array<T> {
  const map = new Map();
  list.forEach((item) => map.set(item.name, item));

  /**
   * The Map remembers the original insertion order of the keys.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
   */
  return Array.from(map.values());
}

interface PictureHocOptionsType<QueryName extends string> {
  mediaQueryList: Array<MediaQueryItemType<QueryName>>;
}

type PictureImagesByQueryNameProps<QueryName extends string> = {
  [key in QueryName]?: PictureImageType;
};

type StrictPictureProps<QueryName extends string> = CommonPictureProps &
  PictureImagesByQueryNameProps<QueryName>;

function createPictureComponent<QueryName extends string>(
  options: PictureHocOptionsType<QueryName>
) {
  const uniqueMediaQueryList = dedupeMediaQueryList(options.mediaQueryList);

  function StrictPicture(props: StrictPictureProps<QueryName>) {
    const imageMap = uniqueMediaQueryList.reduce<
      PictureImagesByQueryNameProps<QueryName>
    >(
      (map, mediaQuery) => ({
        ...map,
        [mediaQuery.name]: props[mediaQuery.name],
      }),
      {}
    );

    return (
      <Picture
        {...props}
        mediaQueryList={uniqueMediaQueryList}
        imageMap={imageMap}
      />
    );
  }

  return StrictPicture;
}

export default createPictureComponent;
