import React from 'react';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { Nullable, RequestError, RequestErrorType } from '@tager/web-core';

import Page from '../../components/Page';

import Error from './Error';

type ErrorType = Error | RequestError | RequestErrorType;

type Props = {
  error?: Nullable<ErrorType>;
  code?: number;
  message?: string;
};

function convertErrorToProps(
  error: Error | RequestError | RequestErrorType
): React.ComponentProps<typeof ErrorPage> {
  if (!error) {
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  if (error instanceof RequestError) {
    const errorObject = error.asObject();

    return {
      code: errorObject.statusCode,
      message: errorObject.errorMessage,
    };
  }

  if ('statusCode' in error && 'errorMessage' in error) {
    return {
      message: error.errorMessage,
      code: error.statusCode,
    };
  }

  return { message: error.toString(), code: StatusCodes.INTERNAL_SERVER_ERROR };
}

export default function ErrorPage({
  error,
  code,
  message,
}: Props): React.ReactElement {
  let errorName: string = message || 'Unknown error';
  let errorCode: number =
    code !== undefined ? code : StatusCodes.INTERNAL_SERVER_ERROR;

  if (error) {
    const { code, message } = convertErrorToProps(error);
    errorCode = code !== undefined ? code : StatusCodes.INTERNAL_SERVER_ERROR;
    errorName = message || '';

    if (errorName === '' && errorCode) {
      errorName = getReasonPhrase(errorCode);
    }
  }

  return (
    <Page title={errorName}>
      <Error errorCode={errorCode} errorName={errorName} />
    </Page>
  );
}
