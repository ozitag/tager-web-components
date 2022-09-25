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
    const errorObject = error.asObject();

    return {
      code: errorObject.statusCode,
      message: errorObject.errorMessage || 'Unknown Error',
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
  error,
  code,
  message,
}: Props): React.ReactElement {
  let errorName: string = message ? message : 'Unknown error';
  let errorCode: number = code !== undefined ? code : 500;

  if (error) {
    const errorData = convertErrorToProps(error);
    errorCode = errorData.code !== undefined ? errorData.code : 500;
    errorName = errorData.message ? errorData.message : 'Unknown error';
  }

  return (
    <Page title={errorName}>
      <Error errorCode={errorCode} errorName={errorName} />
    </Page>
  );
}
