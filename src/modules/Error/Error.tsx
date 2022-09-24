import React from 'react';

import ErrorDevelop from './components/ErrorDevelop';
import ErrorProd from './components/ErrorProd';

type Props = {
  errorName: string;
  errorId?: string;
  errorCode: number;
  getErrorDetails?: (id: string) => Promise<any>;
};

function getErrorName(code: number | string): string {
  const codeString = String(code);

  if (codeString === '404') return 'Page Not Found';

  return 'Server Error';
}

export default function Error({ getErrorDetails, errorCode, errorName, errorId }: Props): React.ReactElement {
  const isDevelopment = process.env.NEXT_PUBLIC_ENV !== 'production';

  return isDevelopment ? (
    <ErrorDevelop
      errorCode={errorCode}
      errorName={errorName}
      errorId={errorId}
      getErrorDetails={getErrorDetails}
    />
  ) : (
    <ErrorProd
      errorCode={errorCode}
      errorName={getErrorName(errorCode)}
      errorId={errorId}
    />
  );
}
