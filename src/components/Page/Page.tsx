import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getOrigin } from '@tager/web-core';

import { getMetaList, getCanonicalUrl, getLdJsonData } from './Page.helpers';

type Props = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  canonicalUrl?: string;
  datePublished?: string;
  dateModified?: string;
};

function Page({
  children,
  title,
  description,
  openGraphTitle,
  openGraphDescription,
  openGraphImage,
  canonicalUrl,
  datePublished,
  dateModified,
}: Props) {
  const router = useRouter();

  const metaList = getMetaList({
    title,
    description,
    openGraphTitle,
    openGraphDescription,
    openGraphImage,
    currentPath: router.asPath,
  });
  const canonicalUrlPrepared = getCanonicalUrl(router.asPath, canonicalUrl);
  const homePageUrl = getOrigin();

  const jsonLdObject = getLdJsonData(
    router.asPath,
    title,
    description,
    openGraphImage,
    datePublished,
    dateModified,
    'OZiTAG',
    '/logo.svg'
  );

  return (
    <>
      <Head>
        <title>{title ?? ''}</title>

        {homePageUrl ? <link href={homePageUrl} rel="home" /> : null}
        {canonicalUrlPrepared ? (
          <link href={canonicalUrlPrepared} rel="canonical" />
        ) : null}

        {metaList.map((metaProps, index) => (
          <meta {...metaProps} key={index} />
        ))}

        {jsonLdObject ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdObject) }}
          />
        ) : null}
      </Head>
      {children}
    </>
  );
}

export default Page;
