import React, { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { useMedia, useOnKeyDown } from '@tager/web-core';

import { ReactComponent as ChevronLeftIcon } from '../../assets/svg/chevron_left.svg';
import { ReactComponent as ChevronRightIcon } from '../../assets/svg/chevron_right.svg';
import { ReactComponent as CloseIcon } from '../../assets/svg/close.svg';
import { getDisplayedPageNumbers } from '../../utils/common';
import { createMediaQuery } from '../../utils/mixin';
import LoadableImage from '../LoadableImage';
import Overlay from '../Overlay';

import { GalleryOptions } from './Gallery.types';

type Props = {
  options: GalleryOptions;
  onClose: () => void;
};

function Gallery({ options, onClose }: Props) {
  const { imageList, initialIndex } = options;

  const isMobile = useMedia(createMediaQuery({ max: 767.98 }));

  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  function prev() {
    setCurrentIndex((prev) => (prev !== 0 ? prev - 1 : prev));
  }

  const next = useCallback(
    () =>
      setCurrentIndex((prev) =>
        prev < imageList.length - 1 ? prev + 1 : prev
      ),
    [imageList.length]
  );

  useOnKeyDown(['ArrowLeft', 'Left'], prev);
  useOnKeyDown(['ArrowRight', 'Right'], next);
  useOnKeyDown(['Escape', 'Esc'], onClose);

  const displayedImageIndexList = useMemo(
    () =>
      getDisplayedPageNumbers({
        pagesCount: imageList.length,
        currentPageNumber: currentIndex + 1,
        maxButtonCount: isMobile ? 3 : 5,
      }).map((number) => number - 1),
    [currentIndex, imageList.length, isMobile]
  );

  return (
    <Overlay onClose={onClose}>
      <Container>
        <ImageContainer>
          <LoadableImage
            src={imageList[currentIndex]?.url}
            spinnerContainerStyle={{ width: '50vw', height: '50vh' }}
            alt=""
          />
        </ImageContainer>
        <ImageFooter>
          <Caption>{imageList[currentIndex]?.caption}</Caption>
          <PageNumber>
            {currentIndex + 1} of {imageList.length}
          </PageNumber>
        </ImageFooter>
      </Container>

      <SmallGallery>
        {imageList.map((image, index) => (
          <SmallImageContainer
            key={image.url}
            onClick={() => setCurrentIndex(index)}
            isActive={index === currentIndex}
            hidden={!displayedImageIndexList.includes(index)}
          >
            <LoadableImage
              src={image.url}
              alt=""
              spinnerContainerStyle={{ width: 50, height: 50 }}
              spinnerProps={{ size: 35, thickness: 2 }}
            />
          </SmallImageContainer>
        ))}
        <SmallArrowButton
          direction="left"
          title="Previous"
          onClick={prev}
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon />
        </SmallArrowButton>
        <SmallArrowButton
          direction="right"
          title="Next"
          onClick={next}
          disabled={currentIndex === imageList.length - 1}
        >
          <ChevronRightIcon />
        </SmallArrowButton>
      </SmallGallery>

      <CloseButton type="button" title="Close" onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <ArrowButton
        direction="left"
        title="Previous"
        onClick={prev}
        disabled={currentIndex === 0}
      >
        <ChevronLeftIcon />
      </ArrowButton>
      <ArrowButton
        direction="right"
        title="Next"
        onClick={next}
        disabled={currentIndex === imageList.length - 1}
      >
        <ChevronRightIcon />
      </ArrowButton>
    </Overlay>
  );
}

const SmallGallery = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
`;

const Container = styled.div`
  position: relative;
  user-select: none;
  max-width: calc(100vw - 192px);

  @media (max-width: 1023.98px) {
    max-width: calc(100vw - 160px);
  }
  @media (max-width: 767.98px) {
    max-width: calc(100vw - 100px);
  }
`;

const ImageContainer = styled.div`
  color: white;
  font-size: 1.5rem;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    max-height: calc(100vh - 290px);
    max-width: 1024px;
  }
`;

const SmallImageContainer = styled.div<{ isActive: boolean }>`
  position: relative;
  margin: 2px;
  cursor: pointer;
  border-radius: 2px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  font-size: 10px;
  color: white;

  ${(props) =>
    props.isActive
      ? css`
          transform: translateY(-7px);
        `
      : null}
  img {
    z-index: -1;
    height: 50px;
    width: 50px;
    object-fit: cover;
  }
`;

const ImageFooter = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const PageNumber = styled.span`
  flex: 0 0 auto;
  display: block;
  padding: 0.5rem;
  color: white;
  opacity: 0.7;
  font-size: 0.9em;

  @media (max-width: 767.98px) {
    font-size: 0.7em;
  }
`;

const Caption = styled.span`
  flex: 1 1 auto;
  display: block;
  padding: 0.5rem;
  color: white;
  opacity: 0.9;

  @media (max-width: 767.98px) {
    font-size: 0.8em;
  }
`;

const NavButton = styled.button`
  transition: background-color 0.1s;

  svg {
    display: block;
    height: 96px;
    width: 96px;
    fill: white;
    transition: opacity 0.1s;
    opacity: 0.9;

    @media (max-width: 1023.98px) {
      width: 80px;
      height: 80px;
    }

    @media (max-width: 767.98px) {
      width: 50px;
      height: 50px;
    }
  }

  &:disabled {
    opacity: 0.3;
  }

  &:not(:disabled):hover {
    background-color: rgba(255, 255, 255, 0.1);

    svg {
      opacity: 1;
    }
  }
`;

const ArrowButton = styled(NavButton)<{ direction: 'right' | 'left' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  ${(props) =>
    props.direction === 'left'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;

const SmallArrowButton = styled(NavButton)<{ direction: 'right' | 'left' }>`
  position: absolute;

  ${(props) =>
    props.direction === 'left'
      ? css`
          left: 0;
          transform: translateX(-100%);
        `
      : css`
          right: 0;
          transform: translateX(100%);
        `}

  svg {
    height: 50px;
    width: 50px;
  }
`;

const CloseButton = styled(NavButton)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.3rem;

  svg {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 767.98px) {
    padding: 0.7rem;

    svg {
      width: 35px;
      height: 35px;
    }
  }
`;

export default Gallery;
