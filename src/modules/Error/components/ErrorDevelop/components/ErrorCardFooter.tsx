import React from 'react';
import styled, { css } from 'styled-components';

import OZiTAGLogo from '../../../../../components/svg/OzitagLogo';
import { media } from '../../../../../config/media';

function ErrorCardFooter() {
  return (
    <ErrorFooter>
      <FooterTager href="https://ozitag.com/tager" target="_blank">
        Made by <span>TAGER</span>
      </FooterTager>
      <FooterOZiTAG href="https://ozitag.com/" target="_blank">
        <OZiTAGLogo />
      </FooterOZiTAG>
    </ErrorFooter>
  );
}

const ErrorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 15px 20px;
  border-top: 1px solid rgb(230, 230, 230);

  ${media.mobile(css`
    padding: 15px;
  `)}
`;

const FooterTager = styled.a`
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 22px;

  span {
    font-weight: 700;
    display: inline-block;
    margin-left: 6px;
    letter-spacing: 0.2em;
    font-size: 18px;
  }
`;

const FooterOZiTAG = styled.a`
  display: inline-block;
  height: 36px;

  svg {
    height: 36px;
  }
`;

export default ErrorCardFooter;
