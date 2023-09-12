import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { assignRef, convertSrcSet, FETCH_STATUSES, FetchStatus, getImageTypeFromUrl, Nullish } from '@tager/web-core';

import Image, { IMAGE_PLACEHOLDER } from '../Image';

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

export interface PictureMediaQueryItemType<QueryName extends string = string> {
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
  imageStyle?: CSSProperties;
  loading?: 'eager' | 'lazy';
  imageRef?: React.Ref<HTMLImageElement>;
  onStatusChange?: (status: FetchStatus) => void;
}

export interface SpecialPictureProps {
  mediaQueryList: Array<PictureMediaQueryItemType>;
  imageMap: { [key: string]: PictureImageType | undefined };
}

interface InitialPictureProps extends CommonPictureProps, SpecialPictureProps {
}

function Picture({
                   src,
                   src2x,
                   srcWebp,
                   srcWebp2x,
                   alt,
                   className,
                   imageStyle,
                   loading,
                   imageRef: outerImageRef,
                   mediaQueryList,
                   imageMap,
                   onStatusChange
                 }: InitialPictureProps) {

  const isLazy = loading === 'lazy';
  const innerImageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<FetchStatus>(FETCH_STATUSES.IDLE);

  const statusChangeHandler = useRef<
    CommonPictureProps['onStatusChange'] | undefined
  >(onStatusChange);

  useEffect(function trackImageLoadStatus() {
    if (!innerImageRef.current) return;

    if (isLazy && status === 'SUCCESS') {
      innerImageRef.current.setAttribute('src', IMAGE_PLACEHOLDER);
      innerImageRef.current.classList.remove('lazyloaded');
      innerImageRef.current.classList.add('lazyload');
    };

    /** If Image is already loaded */
    if (
      innerImageRef.current.src &&
      innerImageRef.current.complete &&
      IMAGE_PLACEHOLDER !== innerImageRef.current.src
    ) {
      setStatus(FETCH_STATUSES.SUCCESS);
      return;
    }

    /** If `lazysizes` didn't change `src` attribute yet */
    if (IMAGE_PLACEHOLDER === innerImageRef.current.src) {
      const mutationObserver = new MutationObserver(function mutationCallback(
        _mutations,
        observer
      ) {

        setStatus(FETCH_STATUSES.LOADING);

        observer.disconnect();

        if (!innerImageRef.current) return;

        if (innerImageRef.current.complete) {
          setStatus(FETCH_STATUSES.SUCCESS);
          return;
        }

        function handleLoad() {
          if (!innerImageRef.current) return;
          innerImageRef.current.removeEventListener('load', handleLoad);
          setStatus(FETCH_STATUSES.SUCCESS);
        }

        function handleError() {
          if (!innerImageRef.current) return;
          innerImageRef.current.removeEventListener('error', handleError);
          setStatus(FETCH_STATUSES.FAILURE);
        }

        innerImageRef.current.addEventListener('load', handleLoad);
        innerImageRef.current.addEventListener('error', handleError);
      });

      mutationObserver.observe(innerImageRef.current, {
        attributes: true,
        attributeFilter: ['src', 'data-src']
      });

      return;
    }

    /** If image is currently loading */
    if (
      innerImageRef.current.src &&
      innerImageRef.current.src !== IMAGE_PLACEHOLDER
    ) {
      setStatus(FETCH_STATUSES.LOADING);

      const handleLoad = () => {
        if (!innerImageRef.current) return;
        innerImageRef.current.removeEventListener('load', handleLoad);
        setStatus(FETCH_STATUSES.SUCCESS);
      };

      const handleError = () => {
        if (!innerImageRef.current) return;
        innerImageRef.current.removeEventListener('error', handleError);
        setStatus(FETCH_STATUSES.FAILURE);
      };

      innerImageRef.current.addEventListener('load', handleLoad);
      innerImageRef.current.addEventListener('error', handleError);
    }
  }, [src]);

  useEffect(
    function updateStatusChangeHandlerRef() {
      statusChangeHandler.current = onStatusChange;
    },
    [onStatusChange]
  );

  useEffect(
    function callStatusChangeHandler() {
      if (statusChangeHandler.current) {
        statusChangeHandler.current(status);
      }
    },
    [status]
  );

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
            webp2x: srcWebp2x
          }}
          isLazy={isLazy}
        />
      ) : null}
      <Image
        style={imageStyle}
        src={src ?? undefined}
        srcSet={src2x ? `${src2x} 2x` : undefined}
        isLazy={isLazy}
        alt={alt ?? ''}
        ref={(imageNode) => {
          assignRef(innerImageRef, imageNode);
          assignRef(outerImageRef, imageNode);
        }}
        data-image-status={status.toLowerCase()}
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

export interface PictureFactoryOptionsType<QueryName extends string> {
  mediaQueryList: Array<PictureMediaQueryItemType<QueryName>>;
}

type PictureImagesByQueryNameProps<QueryName extends string> = {
  [key in QueryName]?: PictureImageType;
};

export type PlainPictureProps<QueryName extends string> = CommonPictureProps &
  PictureImagesByQueryNameProps<QueryName>;

export function createPlainPictureComponent<QueryName extends string>(
  options: PictureFactoryOptionsType<QueryName>
): (props: PlainPictureProps<QueryName>) => JSX.Element {
  const uniqueMediaQueryList = dedupeMediaQueryList(options.mediaQueryList);

  function PlainPicture(props: PlainPictureProps<QueryName>) {
    const imageMap = uniqueMediaQueryList.reduce<
      PictureImagesByQueryNameProps<QueryName>
    >(
      (map, mediaQuery) => ({
        ...map,
        [mediaQuery.name]: props[mediaQuery.name]
      }),
      {}
    );

    let src = props.src;
    if (!props.src) {
      for (const device in imageMap) {
        if (imageMap[device]) {
          src = imageMap[device]?.src || '';
          break;
        }
      }
    }

    return (
      <Picture
        {...props}
        src={src}
        mediaQueryList={uniqueMediaQueryList}
        imageMap={imageMap}
      />
    );
  }

  return PlainPicture;
}
