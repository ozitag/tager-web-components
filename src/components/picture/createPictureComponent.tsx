import React, {
  CSSProperties,
  useMemo,
  useState,
  VoidFunctionComponent
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
): (props: PictureProps<QueryName>) => JSX.Element {
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
    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUSES.IDLE);

    const isLoading = status === FETCH_STATUSES.LOADING;

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
      setStatus(status);

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
        data-picture-status={status.toLowerCase()}
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
  background-color: ${(props) => props.backgroundColor ?? 'transparent'};

  img {
    transition: opacity 0.3s;
  }
`;
