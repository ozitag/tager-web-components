import React from 'react';
import { Head } from 'next/document';

/**
 * Reference:
 * https://github.com/vercel/next.js/blob/v9.5.3/packages/next/pages/_document.tsx#L28-L38
 */
function dedupe<T extends { file: string }>(bundles: T[]): T[] {
  const files = new Set<string>();
  const kept: T[] = [];

  for (const bundle of bundles) {
    if (files.has(bundle.file)) continue;
    files.add(bundle.file);
    kept.push(bundle);
  }
  return kept;
}

/**
 * Reference:
 * https://github.com/vercel/next.js/blob/v9.5.3/packages/next/pages/_document.tsx#L47-L51
 */
type DocumentFiles = {
  sharedFiles: readonly string[];
  pageFiles: readonly string[];
  allFiles: readonly string[];
};

/**
 * Reference: "Hacking Next.js for better PageSpeed scores"
 * https://medium.com/medwing-engineering-product-design/hacking-next-js-for-better-pagespeed-scores-6c651d19f218
 */
class TagerNextHead extends Head {
  /**
   * Reference:
   * https://github.com/vercel/next.js/blob/v9.5.3/packages/next/pages/_document.tsx#L159-L212
   */
  getCssLinks(files: DocumentFiles): JSX.Element[] | null {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      dynamicImports,
    } = this.context;
    const cssFiles = files.allFiles.filter((f) => f.endsWith('.css'));
    const sharedFiles = new Set(files.sharedFiles);

    let dynamicCssFiles = dedupe(
      dynamicImports.filter((f) => f.file.endsWith('.css'))
    ).map((f) => f.file);
    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter(
        (f) => !(existing.has(f) || sharedFiles.has(f))
      );
      cssFiles.push(...dynamicCssFiles);
    }

    const cssLinkElements: JSX.Element[] = [];
    cssFiles.forEach((file) => {
      const isSharedFile = sharedFiles.has(file);

      cssLinkElements.push(
        /** Remove preload "link" tags */
        // <link
        //   key={`${file}-preload`}
        //   nonce={this.props.nonce}
        //   rel="preload"
        //   href={`${assetPrefix}/_next/${encodeURI(
        //     file
        //   )}${devOnlyCacheBusterQueryString}`}
        //   as="style"
        //   crossOrigin={
        //     this.props.crossOrigin || process.env.__NEXT_CROSS_ORIGIN
        //   }
        // />,
        <link
          key={file}
          nonce={this.props.nonce}
          rel="stylesheet"
          href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${devOnlyCacheBusterQueryString}`}
          crossOrigin={
            this.props.crossOrigin || process.env.__NEXT_CROSS_ORIGIN
          }
          data-n-g={isSharedFile ? '' : undefined}
          data-n-p={isSharedFile ? undefined : ''}
        />
      );
    });
    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }

  getPreloadDynamicChunks() {
    return [];
  }

  getPreloadMainLinks() {
    return [];
  }
}

export default TagerNextHead;
