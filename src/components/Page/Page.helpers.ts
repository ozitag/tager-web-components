import { MetaHTMLAttributes } from 'react';

import {
  getAbsoluteUrl,
  isNotNullish,
  Nullish,
  parseUrl,
} from '@tager/web-core';

/**
 * References:
 * 1. https://support.google.com/webmasters/answer/139066
 * 2. https://yoast.com/rel-canonical/
 */

export function getCurrentPath(basePath: Nullish<string>, asPath: string) {
  return basePath && basePath !== '/' ? basePath + asPath : asPath;
}

export function getCanonicalUrl(
  currentPath: string,
  canonicalPath?: Nullish<string>
) {
  const absoluteUrl = getAbsoluteUrl(canonicalPath ?? currentPath);

  const parsedUrl = parseUrl(absoluteUrl);

  /** Remove hash from url */
  return parsedUrl
    ? parsedUrl.origin + parsedUrl.pathname + parsedUrl.search
    : absoluteUrl;
}

export function getLdJsonData(
  currentPath: string,
  title?: Nullish<string>,
  description?: Nullish<string>,
  image?: Nullish<string>,
  datePublished?: Nullish<string>,
  dateModified?: Nullish<string>,
  organizationName?: Nullish<string>,
  logoSrc?: Nullish<string>
) {
  const currentUrl = getAbsoluteUrl(currentPath);

  const result: any = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
  };

  if (title) {
    result.name = title;
  }

  if (description) {
    result.description = description;
  }

  if (image) {
    result.image = [getAbsoluteUrl(image)];
  }

  if (datePublished) {
    result.datePublished = datePublished;
  }

  if (dateModified) {
    result.dateModified = dateModified;
  }

  if (organizationName) {
    result.publisher = {
      '@type': 'Organization',
      name: organizationName,
    };

    if (process.env.NEXT_PUBLIC_ORIGIN) {
      result.publisher.url = process.env.NEXT_PUBLIC_ORIGIN;
    }

    if (logoSrc) {
      result.publisher.logo = {
        '@type': 'ImageObject',
        url: [getAbsoluteUrl(logoSrc)],
      };
    }
  }

  if (currentUrl) {
    result.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': getAbsoluteUrl(currentUrl),
    };
  }

  return result;
}

export function getMetaList({
  title,
  description,
  keywords,
  openGraphTitle,
  openGraphDescription,
  openGraphImage,
  currentPath,
}: {
  title?: Nullish<string>;
  description?: Nullish<string>;
  keywords?: Nullish<string>;
  openGraphTitle?: Nullish<string>;
  openGraphDescription?: Nullish<string>;
  openGraphImage?: Nullish<string>;
  currentPath: string;
}): Array<MetaHTMLAttributes<HTMLMetaElement>> {
  const currentPageUrl = getAbsoluteUrl(currentPath);

  const ogTitle = openGraphTitle || title;
  const ogDescription = openGraphDescription || description;
  return [
    /**
     * HTML Living Standard
     * The definition of '<meta>' in that specification.
     * https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
     */
    {
      name: 'copyright',
      content: 'OZiTAG LLC',
    },
    {
      name: 'author',
      content: 'OZiTAG, ozitag.com',
    },
    description
      ? {
          name: 'description',
          content: description,
        }
      : null,
    keywords
      ? {
          name: 'keywords',
          content: keywords,
        }
      : null,

    /**
     * Metadata for Open Graph protocol
     * Reference: https://ogp.me/
     */

    currentPageUrl
      ? {
          name: 'og:url',
          content: currentPageUrl,
        }
      : null,

    ogTitle
      ? {
          property: 'og:title',
          content: ogTitle,
        }
      : null,
    ogDescription
      ? {
          property: 'og:description',
          content: ogDescription,
        }
      : null,

    openGraphImage
      ? {
          property: 'og:image',
          content: getAbsoluteUrl(openGraphImage),
        }
      : null,

    {
      property: 'og:type',
      content: 'website',
    },

    /**
     * Metadata for Twitter cards
     * Reference: https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
     */
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:creator',
      content: 'OZiTAG, ozitag.com',
    },
    ogTitle
      ? {
          name: 'twitter:title',
          content: ogTitle,
        }
      : null,
    ogDescription
      ? {
          name: 'twitter:description',
          content: ogDescription,
        }
      : null,
    openGraphImage
      ? {
          name: 'twitter:image',
          content: getAbsoluteUrl(openGraphImage),
        }
      : null,
  ].filter(isNotNullish);
}
