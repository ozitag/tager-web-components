import React from 'react';

import ErrorDevelop from './components/ErrorDevelop';
import ErrorProd from './components/ErrorProd';

type Props = {
  errorName: string;
  errorId?: string;
  errorCode: number;
};

function Error({ errorCode, errorName, errorId }: Props) {
  const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

  return isDevelopment ? (
    <ErrorDevelop
      errorCode={errorCode}
      errorName={errorName}
      errorId={errorId}
    />
  ) : (
    <ErrorProd
      errorCode={errorCode}
      errorName="Server Error"
      errorId={errorId}
    />
  );
}

export default Error;
