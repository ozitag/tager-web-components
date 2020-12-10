import { UrlObject } from 'url';

import {
  getRouteMatcher,
  getRouteRegex,
  isDynamicRoute,
} from 'next/dist/next-server/lib/router/utils';
import escapePathDelimiters from 'next/dist/next-server/lib/router/utils/escape-path-delimiters';

import { Nullable } from '@tager/web-core';

import {
  LinkConverterType,
  LinkToPropType,
  TagerLinkProps,
} from '../components/createLinkComponent';

export type DynamicLink = { href: UrlObject; as: string };

type QueryParamValue = number | string | Array<string>;

type QueryParamValueString = string | Array<string>;

function convertQueryValuesToString(
  query: Record<string, QueryParamValue>
): Record<string, QueryParamValueString> {
  return Object.keys(query).reduce<Record<string, QueryParamValueString>>(
    (resultQuery, key) => {
      const value = query[key];

      resultQuery[key] = Array.isArray(value)
        ? value.map(String)
        : String(value);

      return resultQuery;
    },
    {}
  );
}

export type DynamicLinkBuilder<Key extends string> = Readonly<{
  match: (url: string) => ReturnType<ReturnType<typeof getRouteMatcher>>;
  build: (query: Record<Key, QueryParamValue>) => DynamicLink;
}>;

export function createDynamicLinkBuilder<Key extends string>(
  route: string
): DynamicLinkBuilder<Key> {
  if (!isDynamicRoute(route)) {
    throw new Error(`Route "${route}" is not dynamic!`);
  }

  const routeRegex = getRouteRegex(route);
  const routeMatcher = getRouteMatcher(routeRegex);

  return {
    match: (url) => routeMatcher(url),
    build: (query) => {
      const convertedQuery = convertQueryValuesToString(query);

      /**
       * Reference:
       * https://github.com/vercel/next.js/blob/v9.5.1/packages/next/client/page-loader.js#L148-L179
       */
      let interpolatedRoute = route;

      if (
        !Object.keys(routeRegex.groups).every((param) => {
          let value = convertedQuery[param] || '';
          const group = routeRegex.groups[param];

          if (!group) return false;

          const { repeat, optional } = group;

          // support single-level catch-all
          // TODO: more robust handling for user-error (passing `/`)
          let replaced = `[${repeat ? '...' : ''}${param}]`;
          if (optional) {
            replaced = `${!value ? '/' : ''}[${replaced}]`;
          }
          if (repeat && !Array.isArray(value)) value = [value];

          return (
            (optional || param in convertedQuery) &&
            // Interpolate group into data URL if present
            (interpolatedRoute =
              interpolatedRoute.replace(
                replaced,
                repeat
                  ? (value as Array<string>).map(escapePathDelimiters).join('/')
                  : escapePathDelimiters(value as string)
              ) || '/')
          );
        })
      ) {
        interpolatedRoute = ''; // did not satisfy all requirements

        // n.b. We ignore this error because we handle warning for this case in
        // development in the `<Link>` component directly.
      }

      return {
        href: { pathname: route, query },
        as: interpolatedRoute,
      };
    },
  };
}

function buildDynamicLinkIfMatched(
  linkBuilderList: Array<DynamicLinkBuilder<any>>,
  link: string
): Nullable<DynamicLink> {
  for (let linkBuilder of linkBuilderList) {
    const match = linkBuilder.match(link);

    if (match) {
      return linkBuilder.build(match);
    }
  }

  return null;
}

export function createLinkConverter(options: {
  linkBuilderList: Array<DynamicLinkBuilder<any>>;
  staticLinkList: Array<string>;
}): LinkConverterType {
  const cacheMap = new Map<string, TagerLinkProps['to']>();

  return function convertLink(link) {
    if (!link) return '';

    if (typeof link !== 'string') {
      return link;
    }

    if (cacheMap.has(link)) {
      return cacheMap.get(link)!;
    }

    let result: LinkToPropType = link;

    const isStaticLink = options.staticLinkList.includes(link);

    if (!isStaticLink) {
      const builtLink = buildDynamicLinkIfMatched(
        options.linkBuilderList,
        link
      );

      if (builtLink) {
        result = builtLink;
      }
    }

    cacheMap.set(link, result);

    return result;
  };
}
