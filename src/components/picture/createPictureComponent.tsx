import React, {
  CSSProperties,
  useMemo,
  useState,
  VoidFunctionComponent,
} from 'react';
import styled from 'styled-components';

import { FETCH_STATUSES, FetchStatus } from '@tager/web-core';

import Spinner from '../Spinner';

import {
  createPlainPictureComponent,
  PictureFactoryOptionsType,
  PlainPictureProps,
} from './createPlainPictureComponent';

interface SmartPictureProps {
  className?: string;
  useSpinner?: boolean;
  usePlaceholder?: boolean;
  width?: number;
  height?: number;
  placeholderColor?: string;
  spinnerComponent?: VoidFunctionComponent;
}

export type PictureProps<
  QueryName extends string
> = PlainPictureProps<QueryName> & SmartPictureProps;

export function createPictureComponent<QueryName extends string>(
  options: PictureFactoryOptionsType<QueryName>
) {
  const PlainPicture = createPlainPictureComponent(options);

  function SmartPicture({
    className,
    width,
    height,
    useSpinner,
    usePlaceholder,
    placeholderColor,
    spinnerComponent: SpinnerComponent,
    onStatusChange,
    ...plainPictureProps
  }: PictureProps<QueryName>) {
    const [isLoading, setLoading] = useState(false);

    function renderSpinner() {
      return SpinnerComponent ? <SpinnerComponent /> : <Spinner show />;
    }

    const containerStyle = useMemo<CSSProperties | undefined>(
      () =>
        width !== undefined && height !== undefined
          ? { width, height }
          : undefined,
      [height, width]
    );

    const imageStyle = useMemo<CSSProperties | undefined>(
      () =>
        isLoading && (useSpinner || usePlaceholder)
          ? { opacity: 0 }
          : undefined,
      [isLoading, usePlaceholder, useSpinner]
    );

    function handleStatusChange(status: FetchStatus) {
      setLoading(status === FETCH_STATUSES.LOADING);

      if (onStatusChange) {
        onStatusChange(status);
      }
    }

    return (
      <PictureContainer
        className={className}
        style={containerStyle}
        backgroundColor={
          isLoading && usePlaceholder ? placeholderColor : undefined
        }
        data-picture-loading={isLoading}
      >
        {isLoading && useSpinner ? renderSpinner() : null}

        <PlainPicture
          {...plainPictureProps}
          onStatusChange={handleStatusChange}
          imageStyle={imageStyle}
        />
      </PictureContainer>
    );
  }

  return SmartPicture;
}

const PictureContainer = styled.div<{ backgroundColor?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  background-color: ${(props) => props.backgroundColor ?? 'none'};

  img {
    transition: opacity 0.3s;
  }
`;
