import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { ModalProps } from '../Modal';
import { ReactComponent as ChevronTop } from '@assets/svg/chevron_top.svg';
import { useOnKeyDown } from '@tager/web-core';

type Props = ModalProps<{
  imageList: Array<string>;
  initialIndex?: number;
}>;

function Gallery({ innerProps, closeModal }: Props) {
  const { imageList, initialIndex } = innerProps;

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
  useOnKeyDown(['Escape', 'Esc'], closeModal);

  return (
    <Container>
      <NavButton direction="left" onClick={prev} disabled={currentIndex === 0}>
        <ChevronTop />
      </NavButton>
      <PhotoContainer>
        <img src={imageList[currentIndex]} alt="" />
      </PhotoContainer>
      <NavButton
        direction="right"
        onClick={next}
        disabled={currentIndex === imageList.length - 1}
      >
        <ChevronTop />
      </NavButton>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 992px;
  height: 600px;

  display: flex;
  align-items: center;
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  flex-shrink: 0;
  transform: rotate(
    ${(props) => (props.direction === 'left' ? '270deg' : '90deg')}
  );

  svg {
    display: block;
    height: 96px;
    width: 96px;
    fill: white;
  }

  &:disabled {
    opacity: 0.3;
  }
`;

const PhotoContainer = styled.div`
  flex: 1;
  height: 600px;
  width: 800px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

export default Gallery;
