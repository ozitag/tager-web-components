import React from 'react';

import { RequestError } from '@tager/web-core';

import Page from '../../components/Page';

import Error from './Error';

type Props = {
  error?: Error | RequestError;
  code?: number;
  message?: string;
};

function convertErrorToProps(
  error: Error | RequestError
): React.ComponentProps<typeof ErrorPage> {
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

  return { message: error.toString(), code: 500 };
}

export default function ErrorPage({
  code,
  message,
  error,
}: Props): React.ReactElement {
  if (error) {
    const errorData = convertErrorToProps(error);
    code = errorData.code;
    message = errorData.message;
  }

  return (
    <Page title={message}>
      <Error errorCode={code || 500} errorName={message || 'Unknown error'} />
    </Page>
  );
}
