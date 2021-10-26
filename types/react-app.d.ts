/// <reference types="node" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react" />
/// <reference types="react-dom" />

/**
 * Source:
 * https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/lib/react-app.d.ts
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_ENV:
      | 'production'
      | 'development'
      | 'local'
      | undefined;
    readonly NEXT_PUBLIC_ORIGIN: string | undefined;
    readonly NEXT_PUBLIC_API_URL: string | undefined;
    readonly NEXT_PUBLIC_SENTRY_DSN: string | undefined;
    readonly NEXT_PUBLIC_SENTRY_ENVIRONMENT: 'web' | 'admin' | undefined;
    readonly NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID: string | undefined;
    readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: string | undefined;
    readonly NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: string | undefined;
    readonly NEXT_PUBLIC_FACEBOOK_PIXEL_ID: string | undefined;
    readonly NEXT_PUBLIC_SPLASHSCREEN_ENABLED: string | undefined;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
