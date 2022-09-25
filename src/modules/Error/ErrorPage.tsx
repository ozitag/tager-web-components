import React from 'react';

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
      code: 500,
      message: 'Unknown error',
    };
  }

  if (error instanceof RequestError) {
    let errorMessage = 'Unknown Error';

    if (error.body && typeof error.body === 'object') {
      errorMessage =
        'message' in error.body ? error.body['message'] : error.status.text;
    }

    return {
      code: error.status.code,
      message: errorMessage,
    };
  }

  if ('statusCode' in error && 'errorMessage' in error) {
    return {
      message: error.errorMessage,
      code: error.statusCode,
    };
  }

  return { message: error.toString(), code: 500 };
}

export default function ErrorPage({
  code,
  message,
  error,
}: Props): React.ReactElement {
  let errorName: string = message ? message : 'Unknown error';
  let errorCode: number = code ? code : 500;

  if (error) {
    const errorData = convertErrorToProps(error);
    errorCode = errorData.code ? errorData.code : 500;
    errorName = errorData.message ? errorData.message : 'Unknown error';
  }

  return (
    <Page title={errorName}>
      <Error errorCode={errorCode} errorName={errorName} />
    </Page>
  );
}
