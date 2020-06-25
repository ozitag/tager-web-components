import { isStringGuard } from '@tager/web-core';

export function isPreloaderEnabled() {
  const isEnabledEnv = process.env.NEXT_PUBLIC_SPLASHSCREEN_ENABLED;

  return (
    isStringGuard(isEnabledEnv) &&
    (isEnabledEnv.toLowerCase() === 'true' || isEnabledEnv === '1')
  );
}
