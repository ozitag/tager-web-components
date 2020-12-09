import React, {
  CSSProperties,
  useMemo,
  useState,
  VoidFunctionComponent,
} from 'react';
import styled from 'styled-components';

import {
  createPlainPictureComponent,
  PictureFactoryOptionsType,
  PlainPictureProps,
} from './createPlainPictureComponent';
import Spinner from './Spinner';

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

    return (
      <PictureContainer
        className={className}
        style={containerStyle}
        backgroundColor={
          isLoading && usePlaceholder ? placeholderColor : undefined
        }
      >
        {isLoading && useSpinner ? renderSpinner() : null}

        <PlainPicture
          {...plainPictureProps}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
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
`;
