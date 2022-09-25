import React from 'react';
import styled, { css } from 'styled-components';

import { media } from '../../../../config/media';

type Props = {
  errorCode: number;
  errorName: string;
  errorId?: string;
};

function ErrorProd({ errorCode, errorName, errorId }: Props) {
  return (
    <Container>
      <Inner>
        {errorCode !== 0 ? <Code>{errorCode}</Code> : null}
        <Name>{errorName}</Name>
        {errorId ? <EventId>Error ID: {errorId}</EventId> : null}
      </Inner>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-bottom: 35px;
  text-align: center;
  color: #262626;
  background-color: rgb(245, 245, 245);
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 960px;
`;

const Code = styled.span`
  max-width: 100%;
  font-size: 180px;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 0 1px #000;

  ${media.tabletLarge(css`
    font-size: 160px;
  `)}

  ${media.tabletSmall(css`
    font-size: 130px;
  `)}
  
  ${media.mobile(css`
    font-size: 100px;
  `)}
`;

const Name = styled.span`
  max-width: 100%;
  margin-top: 15px;
  font-size: 60px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #000;

  ${media.tabletLarge(css`
    font-size: 40px;
  `)}

  ${media.tabletSmall(css`
    font-size: 30px;
  `)}
  
  ${media.mobile(css`
    font-size: 20px;
  `)}
`;

const EventId = styled.span`
  max-width: 100%;
  margin-top: 50px;
  font-size: 15px;
  color: #aaaaaa;

  ${media.tabletSmall(css`
    margin-top: 35px;
    font-size: 13px;
  `)}

  ${media.mobile(css`
    margin-top: 20px;
    font-size: 12px;
  `)}
`;

export default ErrorProd;
